import { useState } from "react";
import { UploadCloud, Sparkles, Send } from "lucide-react";

export const NewReportPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
        <p className="mt-1 text-sm text-gray-500">
          Provide details about the facility issue so our staff can
          resolve it quickly.
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
              <div className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 transition-colors hover:border-red-400 hover:bg-red-50/50">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-semibold text-red-600 focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 focus-within:outline-none hover:text-red-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
              {!isSubmitting && <Send size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
