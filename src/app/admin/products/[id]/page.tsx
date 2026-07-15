"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";
import { getProductByIdAsync, saveProductAsync, getProductsAsync, Review, getReviewsByProduct, saveReview, deleteReview, uploadProductImage } from "@/lib/admin-store";

const emptyProduct: Product = {
  id: "",
  name: "",
  price: 0,
  image: "/images/saree-hero-1.png",
  category: "pure-silk",
  section: "sarees",
  categoryLabel: "Pure Silk",
  sectionLabel: "Sarees",
  weaveTime: "",
  artisanOrigin: "",
  threadCount: "",
  description: "",
  details: [],
  inStock: true,
  artisanStory: "",
  careInstructions: [],
  images: [],
};

const categoryOptions = [
  // Sarees
  { value: "pure-silk", label: "Pure Silk", section: "sarees", sectionLabel: "Sarees" },
  { value: "traditional-ikat", label: "Traditional Ikat", section: "sarees", sectionLabel: "Sarees" },
  { value: "exclusive-masterpieces", label: "Exclusive Masterpiece", section: "sarees", sectionLabel: "Sarees" },
  // Ladies Wear
  { value: "ladies-wear-kurta", label: "Kurta Set", section: "ladies-wear", sectionLabel: "Ladies Wear" },
  { value: "ladies-wear-dupatta", label: "Dupatta", section: "ladies-wear", sectionLabel: "Ladies Wear" },
  { value: "ladies-wear-dress-material", label: "Dress Material", section: "ladies-wear", sectionLabel: "Ladies Wear" },
  // Cut Pieces
  { value: "cut-pieces-silk", label: "Silk Cut Piece", section: "cut-pieces", sectionLabel: "Cut Pieces" },
  { value: "cut-pieces-cotton", label: "Cotton Cut Piece", section: "cut-pieces", sectionLabel: "Cut Pieces" },
  { value: "cut-pieces-blouse", label: "Blouse Piece", section: "cut-pieces", sectionLabel: "Cut Pieces" },
];

// Image upload progress state
interface UploadProgress {
  fileName: string;
  percent: number;
  status: "uploading" | "done" | "error";
}

export default function AdminProductEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === "new";

  const [product, setProduct] = useState<Product>(emptyProduct);
  const [detailsText, setDetailsText] = useState("");
  const [careText, setCareText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Partial<Review>>({ rating: 5 });
  const [isCompressingReview, setIsCompressingReview] = useState(false);

  // Image upload progress
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);

    const loadData = async () => {
      try {
        if (!isNew) {
          const found = await getProductByIdAsync(id);
          if (found) {
            setProduct(found);
            setDetailsText(found.details.join("\n"));
            setCareText((found.careInstructions || []).join("\n"));
            setReviews(getReviewsByProduct(id));
          }
        } else {
          // Generate new ID
          const allProducts = await getProductsAsync();
          setProduct({
            ...emptyProduct,
            id: `AH-${String(allProducts.length + 1).padStart(3, "0")}`,
          });
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setIsLoadingProduct(false);
      }
    };
    loadData();
  }, [id, isNew]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    const selectedCatOpt = categoryOptions.find((c) => c.value === product.category);
    const categoryLabel = selectedCatOpt?.label || "Pure Silk";
    const section = (selectedCatOpt?.section || "sarees") as Product["section"];
    const sectionLabel = selectedCatOpt?.sectionLabel || "Sarees";

    // Use first gallery image as the main image if no main image set
    const mainImage = product.images && product.images.length > 0
      ? product.images[0]
      : product.image;

    const updatedProduct: Product = {
      ...product,
      image: mainImage,
      categoryLabel,
      section,
      sectionLabel,
      details: detailsText.split("\n").filter((d) => d.trim()),
      careInstructions: careText.split("\n").filter((c) => c.trim()),
    };

    try {
      await saveProductAsync(updatedProduct);
      router.push("/admin/products");
    } catch (err) {
      console.error("Save failed:", err);
      setSaveError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsCompressingReview(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadProductImage(files[i]);
        uploadedUrls.push(url);
      }

      setNewReview((prev) => ({ 
        ...prev, 
        images: [...(prev.images || []), ...uploadedUrls] 
      }));
    } finally {
      setIsCompressingReview(false);
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    // Initialize progress for each file
    const initialProgress: UploadProgress[] = Array.from(files).map((f) => ({
      fileName: f.name,
      percent: 0,
      status: "uploading" as const,
    }));
    setUploadProgress(initialProgress);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const url = await uploadProductImage(file, (percent) => {
            setUploadProgress((prev) =>
              prev.map((p, idx) =>
                idx === i ? { ...p, percent, status: "uploading" } : p
              )
            );
          });
          uploadedUrls.push(url);
          setUploadProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, percent: 100, status: "done" } : p
            )
          );
        } catch (err) {
          console.error(`Upload failed for ${file.name}:`, err);
          setUploadProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: "error" } : p
            )
          );
        }
      }

      if (uploadedUrls.length > 0) {
        setProduct((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls],
          // Set main image to first uploaded if none exists
          image: prev.image === "/images/saree-hero-1.png" && uploadedUrls[0]
            ? uploadedUrls[0]
            : prev.image,
        }));
      }

      // Clear progress after a delay
      setTimeout(() => setUploadProgress([]), 3000);
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = "";
    }
  };

  const handleAddReview = () => {
    if (!newReview.customerName || !newReview.comment) return;
    
    const review: Review = {
      id: `REV-${Date.now()}`,
      productId: product.id,
      customerName: newReview.customerName,
      rating: newReview.rating || 5,
      comment: newReview.comment,
      images: newReview.images,
      createdAt: new Date().toISOString()
    };

    saveReview(review);
    setReviews(getReviewsByProduct(product.id));
    setNewReview({ rating: 5 }); // reset
  };

  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId);
    setReviews(getReviewsByProduct(product.id));
  };

  if (!isClient) return null;

  if (isLoadingProduct) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-white/30" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-white text-xl font-medium tracking-tight">
              {isNew ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-white/30 text-xs font-mono mt-0.5">
              {product.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Link
              href={`/catalog/${product.id}`}
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 bg-white/5 text-white/50 text-sm rounded-lg hover:bg-white/10 transition-colors"
            >
              <Eye size={14} />
              Preview
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading || !product.name || !product.price}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isSaving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </motion.div>

      {/* Save Error Alert */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-400 font-medium">Failed to save product</p>
            <p className="text-xs text-red-400/70 mt-1">{saveError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Basic Information
            </h3>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                placeholder="e.g. Nilambari — The Midnight Sky"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={product.price || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="18500"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={product.originalPrice || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      originalPrice: parseInt(e.target.value) || undefined,
                    })
                  }
                  placeholder="22000 (optional)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Category
                </label>
                <select
                  value={product.category}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      category: e.target.value as Product["category"],
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  aria-label="Product category"
                >
                  {categoryOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-[#1a1a1a]"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Stock Status
                </label>
                <select
                  value={product.inStock ? "in-stock" : "out-of-stock"}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      inStock: e.target.value === "in-stock",
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  aria-label="Stock status"
                >
                  <option value="in-stock" className="bg-[#1a1a1a]">
                    In Stock
                  </option>
                  <option value="out-of-stock" className="bg-[#1a1a1a]">
                    Out of Stock
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Description
            </h3>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Product Description
              </label>
              <textarea
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                rows={4}
                placeholder="Describe the saree's beauty, craftsmanship, and unique qualities..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Product Details (one per line)
              </label>
              <textarea
                value={detailsText}
                onChange={(e) => setDetailsText(e.target.value)}
                rows={5}
                placeholder={"Pure Mulberry Silk\nDouble Ikat Technique\nNatural Indigo Dye\nGold Zari Border\n6.2m with Blouse Piece"}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none font-mono"
              />
            </div>
          </div>

          {/* Artisan & Care */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Artisan Story & Care
            </h3>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Artisan Story
              </label>
              <textarea
                value={product.artisanStory || ""}
                onChange={(e) =>
                  setProduct({ ...product, artisanStory: e.target.value })
                }
                rows={4}
                placeholder="Tell the story of the artisan who crafted this piece..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Care Instructions (one per line)
              </label>
              <textarea
                value={careText}
                onChange={(e) => setCareText(e.target.value)}
                rows={4}
                placeholder={"Dry clean only for best results\nStore in a muslin cloth\nAvoid direct sunlight"}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none font-mono"
              />
            </div>
          </div>

          {/* Manage Reviews */}
          {!isNew && (
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-6">
              <h3 className="text-xs text-white/30 uppercase tracking-wider">
                Happy Customer Reviews
              </h3>

              {/* Add New Review Form */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
                <h4 className="text-sm font-medium text-white/80">Add New Review</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5">Customer Name</label>
                    <input
                      type="text"
                      value={newReview.customerName || ""}
                      onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                      placeholder="e.g. Priya S."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={newReview.rating || 5}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      placeholder="5"
                      title="Rating from 1 to 5"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Customer Comment</label>
                  <textarea
                    value={newReview.comment || ""}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/25 transition-colors resize-none"
                    rows={3}
                    placeholder="Their feedback from WhatsApp..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Happy Customer Photos (Optional)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      title="Upload customer photos"
                      onChange={handleReviewImageUpload}
                      disabled={isCompressingReview}
                      className="text-xs text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20 disabled:opacity-50"
                    />
                    {isCompressingReview && (
                      <div className="flex items-center gap-2 text-xs text-amber-400">
                        <div className="w-3.5 h-3.5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                        Compressing...
                      </div>
                    )}
                  </div>
                  {newReview.images && newReview.images.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {newReview.images.map((img, idx) => (
                        <div key={idx} className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                          <Image src={img} alt="preview" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Fallback for legacy single image preview */}
                  {!newReview.images?.length && newReview.image && (
                    <div className="w-12 h-12 relative rounded overflow-hidden mt-4">
                      <Image src={newReview.image} alt="preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddReview}
                  disabled={!newReview.customerName || !newReview.comment}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Add Review
                </button>
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-white/40">No reviews added yet.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="flex gap-4 p-4 border border-white/5 rounded-lg bg-white/[0.02]">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">{r.customerName}</p>
                            <p className="text-xs text-white/40">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteReview(r.id)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-sm text-white/70 mt-2 line-clamp-2">{r.comment}</p>
                        
                        {/* Display Multiple Images or Legacy Single Image */}
                        {(r.images?.length ? r.images : (r.image ? [r.image] : [])).length > 0 && (
                          <div className="flex gap-2 mt-3 overflow-x-auto">
                            {(r.images?.length ? r.images : (r.image ? [r.image] : [])).map((img, idx) => (
                              <div key={idx} className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                                <Image src={img} alt={`${r.customerName} photo ${idx + 1}`} fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Product Images
            </h3>
            
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white/5 mb-4 group">
              {product.image && (
                <Image
                  src={product.image}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {product.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded overflow-hidden group">
                    <Image src={img} alt={`Product photo ${idx + 1}`} fill className="object-cover" />
                    <button
                      onClick={() => setProduct((prev) => ({
                        ...prev,
                        images: prev.images?.filter((_, i) => i !== idx) || []
                      }))}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      title="Remove image"
                      aria-label={`Remove image ${idx + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Upload Product Photos
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                title="Upload product photos"
                onChange={handleProductImageUpload}
                disabled={isUploading}
                className="w-full text-xs text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20 disabled:opacity-50"
              />

              {/* Upload Progress Bars */}
              {uploadProgress.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadProgress.map((up, idx) => (
                    <div key={idx} className="p-2.5 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-white/60 truncate max-w-[180px]">
                          {up.status === "done" ? (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 size={12} />
                              {up.fileName}
                            </span>
                          ) : up.status === "error" ? (
                            <span className="flex items-center gap-1 text-red-400">
                              <AlertCircle size={12} />
                              {up.fileName}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Loader2 size={12} className="animate-spin text-blue-400" />
                              {up.fileName}
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">
                          {up.percent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ease-out ${
                            up.status === "done"
                              ? "bg-emerald-400"
                              : up.status === "error"
                              ? "bg-red-400"
                              : "bg-blue-400"
                          }`}
                          style={{ width: `${up.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <label className="block text-xs text-white/40 mb-1.5">
                Main Image URL (Fallback)
              </label>
              <input
                type="text"
                value={product.image}
                onChange={(e) =>
                  setProduct({ ...product, image: e.target.value })
                }
                placeholder="/images/saree-hero-1.png"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Craft Details */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Craft Details
            </h3>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Weave Time
              </label>
              <input
                type="text"
                value={product.weaveTime}
                onChange={(e) =>
                  setProduct({ ...product, weaveTime: e.target.value })
                }
                placeholder="45 Days"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Artisan Origin
              </label>
              <input
                type="text"
                value={product.artisanOrigin}
                onChange={(e) =>
                  setProduct({ ...product, artisanOrigin: e.target.value })
                }
                placeholder="Sonepur, Odisha"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Thread Count
              </label>
              <input
                type="text"
                value={product.threadCount}
                onChange={(e) =>
                  setProduct({ ...product, threadCount: e.target.value })
                }
                placeholder="120 TPI"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
