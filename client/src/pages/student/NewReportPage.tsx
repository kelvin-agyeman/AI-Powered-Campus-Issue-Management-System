import { useState } from "react";
import { UploadCloud, Sparkles, Send, Check, X } from "lucide-react";
import { useCreateIssue } from "../../hooks/useStudent";

export const NewReportPage = () => {
  const [location, setLocation] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const { mutate: createIssue, isPending } = useCreateIssue();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const cleanLocation = location.trim();
    const cleanRoom = roomNumber.trim();
    const fullLocation = cleanRoom
      ? `${cleanLocation}, ${cleanRoom}`
      : cleanLocation;

    formData.append("location", fullLocation);
    formData.append("description", description.trim());

    // Append each file to 'images' array key for backend Multer processing
    files.forEach((file) => {
      formData.append("images", file);
    });

    createIssue(formData);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
        <p className="mt-1 text-sm text-gray-500">
          Provide details about the facility issue so our staff can resolve it
          quickly.
        </p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* AI Assist Banner */}
          <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-800">
            <Sparkles className="mt-0.5 shrink-0 text-red-500" size={20} />
            <div>
              <h3 className="font-medium">AI Smart Routing Enabled</h3>
              <p className="mt-1 text-sm text-red-700/80">
                Just describe the issue clearly. Our system will automatically
                categorize it and route it to the correct facility manager.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="text-sm font-medium text-gray-700"
              >
                Location / Building
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Science Faculty Block A"
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="room"
                className="text-sm font-medium text-gray-700"
              >
                Room Number (Optional)
              </label>
              <input
                type="text"
                id="room"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g., Room 402"
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Detailed Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail..."
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Photo Evidence (Recommended)
              </label>
              <div className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-red-400 hover:bg-red-50/50">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="mt-2 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-semibold text-red-600 focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 focus-within:outline-none hover:text-red-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>

                {/* Selected Files Preview List */}
                {files.length > 0 && (
                  <div className="mt-4 flex w-full flex-wrap gap-2 border-t border-gray-200 pt-2">
                    {files.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        <Check size={12} className="text-green-600" />
                        <span className="max-w-37.5 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="ml-1 cursor-pointer text-gray-400 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={isPending || !location || !description}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
            >
              {isPending ? "Submitting..." : "Submit Report"}
              {!isPending && <Send size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
