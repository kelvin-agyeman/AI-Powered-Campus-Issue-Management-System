import { useState, useRef } from "react";
import { User, Save, Camera, Trash2 } from "lucide-react";

export const AdminSettingsPage = () => {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers for your specific backend flows ---

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    // TODO: Send updated fullName and avatar to backend
    setTimeout(() => setIsSavingProfile(false), 1000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setIsDeletingAvatar(true);
    // TODO: Call your backend endpoint to delete the avatar
    setTimeout(() => {
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsDeletingAvatar(false);
    }, 800);
  };

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal profile and account credentials.
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* SECTION 1: Standard Profile Edit (Avatar & Name) */}
          <form
            onSubmit={handleProfileSave}
            className="border-b border-gray-100 p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3 text-lg font-semibold text-gray-900">
              <User size={20} className="text-red-600" />
              <h2>Profile</h2>
            </div>

            <div className="flex flex-col gap-8 sm:flex-row">
              {/* Avatar Upload & Delete */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-gray-50 bg-gray-100 shadow-sm">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-red-100 text-2xl font-bold text-red-600">
                      AD
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-0 bottom-0 left-0 flex cursor-pointer items-center justify-center bg-black/50 py-1 text-white transition-colors hover:bg-black/70"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">JPG, PNG or GIF</span>
                  {/* Delete Avatar Button */}
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={isDeletingAvatar || !avatarPreview} // Adjust logic if user always has an avatar from DB
                    className="mt-1 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    {isDeletingAvatar ? "Deleting..." : "Delete Avatar"}
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Admin User"
                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                  >
                    {isSavingProfile ? "Saving..." : "Save Profile"}
                    {!isSavingProfile && <Save size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
