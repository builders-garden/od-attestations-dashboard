/**
 * Upload image to IPFS
 * @param imageFile Image file to upload, must be a File object (e.g. from an input element)
 * @returns IPFS hash of the uploaded image
 */
export const uploadImageToIpfs: (
  imageFile: File | null,
) => Promise<string | undefined> = async (imageFile: File | null) => {
  try {
    if (!imageFile) throw new Error("No image file provided");

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();

    if (data?.hash) {
      return data.hash;
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

export const getIpfsImageUrl = (cid: string) => {
  return `https://${cid}.ipfs.flk-ipfs.xyz/`;
};
