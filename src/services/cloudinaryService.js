export async function uploadImage(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  console.log("Uploading to Cloudinary...", { cloudName, preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET });

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Cloudinary response:", data);

    if (!res.ok || !data?.secure_url) {
      throw new Error(data?.error?.message || "تعذر رفع الصورة إلى Cloudinary حاليًا.");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(error.message || "تعذر رفع الصورة إلى Cloudinary حاليًا.");
  }
}
