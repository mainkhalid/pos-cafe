import React, { useState, useCallback, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt, FaImage, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { MdDelete, MdDragIndicator, MdEdit } from "react-icons/md";
import { BiCoffee, BiDollar } from "react-icons/bi";
import { toast } from 'react-toastify';
import productCategory from '../helpers/productCategory';
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';

// Enhanced ImageUploader subcomponent with drag-and-drop
const ImageUploader = ({ images, onImageUpload, onImageDelete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const handleUpload = async (files) => {
    const file = files[0] || files;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG or WebP)');
      return;
    }
    
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      const uploadImageCloudinary = await uploadImage(file);
      onImageUpload(uploadImageCloudinary.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
          dragActive 
            ? 'border-amber-500 bg-amber-50' 
            : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type='file' 
          id='uploadImageInput' 
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer' 
          onChange={(e) => handleUpload(e.target.files)} 
          accept="image/png, image/jpeg, image/jpg, image/webp"
          disabled={isUploading}
        />
        
        <div className='text-center'>
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <FaSpinner className="text-4xl text-amber-600 animate-spin" />
              <p className="text-amber-600 font-medium">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <FaCloudUploadAlt className="text-2xl text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">Drop your image here, or click to browse</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FaImage className="text-amber-600" />
            <h4 className="text-sm font-medium text-gray-700">Product Images ({images.length})</h4>
          </div>
          
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
            {images.map((imageUrl, index) => (
              <div key={`image-${index}-${imageUrl.slice(-8)}`} className='relative group'>
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-amber-300 transition-colors">
                  <img 
                    src={imageUrl} 
                    alt={`Product image ${index + 1}`} 
                    className='w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200'
                    onClick={() => window.open(imageUrl, '_blank')}
                  />
                </div>
                
                <button
                  type="button"
                  aria-label="Delete image"
                  className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
                  onClick={() => onImageDelete(index)}
                >
                  <MdDelete size={12} />
                </button>
                
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {images.length === 0 && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <FaTimes className="text-sm" />
          <p className='text-sm'>At least one product image is required</p>
        </div>
      )}
    </div>
  );
};

// Form field component for consistency
const FormField = ({ label, error, children, required = false, icon }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {icon && <span className="text-amber-600">{icon}</span>}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <FaTimes size={12} />
        {error}
      </div>
    )}
  </div>
);

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName || "",
    brandName: productData?.brandName || "",
    category: productData?.category || "",
    productImage: productData?.productImage || [],
    description: productData?.description || "",
    price: productData?.price || "",
    sellingPrice: productData?.sellingPrice || ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const [formTouched, setFormTouched] = useState(false);

  // Calculate discount percentage if selling price exists
  const discountPercentage = data.price && data.sellingPrice 
    ? Math.round(((data.price - data.sellingPrice) / data.price) * 100)
    : 0;

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!data.productName.trim()) {
      newErrors.productName = 'Product name is required';
    } else if (data.productName.trim().length < 3) {
      newErrors.productName = 'Product name must be at least 3 characters';
    }
    
    if (!data.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (data.productImage.length === 0) {
      newErrors.productImage = 'At least one product image is required';
    }
    
    if (!data.price || Number(data.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    // Only validate selling price if it exists
    if (data.sellingPrice && Number(data.sellingPrice) >= Number(data.price)) {
      newErrors.sellingPrice = 'Selling price must be less than regular price';
    }
    
    if (!data.description.trim()) {
      newErrors.description = 'Product description is required';
    } else if (data.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    return newErrors;
  }, [data]);

  // Update errors when form data changes
  useEffect(() => {
    if (formTouched) {
      setErrors(validateForm());
    }
  }, [data, formTouched, validateForm]);

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setFormTouched(true);
  }, []);

  const handleImageUpload = useCallback((imageUrl) => {
    setData(prev => ({
      ...prev,
      productImage: [...prev.productImage, imageUrl]
    }));
    
    setFormTouched(true);
  }, []);

  const handleDeleteProductImage = useCallback((index) => {
    setData(prev => {
      const newProductImage = [...prev.productImage];
      newProductImage.splice(index, 1);
      return {
        ...prev,
        productImage: newProductImage
      };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true);
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Please fix the form errors before submitting');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(SummaryApi.updateProduct.url, {
        method: SummaryApi.updateProduct.method,
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (responseData.success) {
        toast.success(responseData?.message || 'Product updated successfully');
        onClose();
        fetchdata();
      } else {
        toast.error(responseData?.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div 
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className='bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl'>
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50'>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <MdEdit className="text-white text-xl" />
            </div>
            <div>
              <h2 id="modal-title" className='text-xl font-bold text-gray-800'>Edit Product</h2>
              <p className="text-sm text-gray-600">Update product information and details</p>
            </div>
          </div>
          
          <button 
            className='w-10 h-10 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors'
            onClick={onClose}
            aria-label="Close modal"
          >
            <CgClose className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]' onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-5">
              <FormField 
                label="Product Name" 
                error={errors.productName} 
                required
                icon={<BiCoffee />}
              >
                <input 
                  type='text' 
                  placeholder='Enter product name' 
                  name='productName'
                  value={data.productName} 
                  onChange={handleOnChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                    errors.productName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                />
              </FormField>

              {/* Brand Name - Optional */}
              {data.brandName !== undefined && (
                <FormField 
                  label="Brand Name"
                  error={errors.brandName}
                >
                  <input 
                    type='text' 
                    placeholder='Enter brand name' 
                    name='brandName'
                    value={data.brandName} 
                    onChange={handleOnChange}
                    className='w-full px-4 py-3 border border-gray-300 bg-gray-50 focus:bg-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all'
                  />
                </FormField>
              )}

              <FormField 
                label="Category" 
                error={errors.category} 
                required
              >
                <select 
                  value={data.category} 
                  name='category' 
                  onChange={handleOnChange} 
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                    errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                >
                  <option value="" disabled>Select Category</option>
                  {productCategory.map((el) => (
                    <option value={el.value} key={el.value}>{el.label}</option>
                  ))}
                </select>
              </FormField>

              {/* Pricing Section */}
              <FormField 
                label="Regular Price" 
                error={errors.price} 
                required
                icon={<BiDollar />}
              >
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type='number' 
                    placeholder='0.00' 
                    value={data.price} 
                    name='price'
                    onChange={handleOnChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                      errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                  />
                </div>
              </FormField>

              {/* Selling Price - Optional */}
              {data.sellingPrice !== undefined && (
                <FormField 
                  label="Sale Price (Optional)" 
                  error={errors.sellingPrice}
                  icon={<BiDollar />}
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type='number' 
                        placeholder='0.00' 
                        value={data.sellingPrice} 
                        name='sellingPrice'
                        onChange={handleOnChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                          errors.sellingPrice ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                      />
                    </div>
                    
                    {discountPercentage > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheck className="text-green-500" />
                        <span className="text-green-600 font-medium">
                          {discountPercentage}% discount applied
                        </span>
                      </div>
                    )}
                  </div>
                </FormField>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <FormField 
                label="Product Images" 
                error={errors.productImage} 
                required
                icon={<FaImage />}
              >
                <ImageUploader 
                  images={data.productImage} 
                  onImageUpload={handleImageUpload} 
                  onImageDelete={handleDeleteProductImage}
                />
              </FormField>

              <FormField 
                label="Description" 
                error={errors.description} 
                required
              >
                <textarea 
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder='Describe your product in detail...' 
                  rows={6} 
                  onChange={handleOnChange} 
                  name='description'
                  value={data.description}
                />
                <div className="text-right text-sm text-gray-500">
                  {data.description.length}/500 characters
                </div>
              </FormField>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              className={`px-8 py-3 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg ${
                isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 hover:shadow-xl'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Updating Product...
                </div>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage 
          onClose={() => setOpenFullScreenImage(false)} 
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;