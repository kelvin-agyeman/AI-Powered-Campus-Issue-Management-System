import { useState, useRef, useEffect } from "react";
import {
  User,
  Save,
  Camera,
  Mail,
  ShieldAlert,
  LogOut,
  Trash2,
  X,
} from "lucide-react";

export const StudentSettingsPage = () => {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal States
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);

  // Form States for Modals
  const [newEmail, setNewEmail] = useState("");
  const [newId, setNewId] = useState("");
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  // Prevent background scrolling when a modal is open
  useEffect(() => {
    if (isEmailModalOpen || isIdModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEmailModalOpen, isIdModalOpen]);

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

  const handleIdChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingModal(true);
    // TODO: Trigger sendEditDetailsRequest for Institution ID
    setTimeout(() => {
      setIsSubmittingModal(false);
      setIsIdModalOpen(false);
      setNewId("");
      // Typically you would log the user out here on success
    }, 1500);
  };

  const handleEmailUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingModal(true);
    // TODO: Trigger updateEmail for personal email
    setTimeout(() => {
      setIsSubmittingModal(false);
      setIsEmailModalOpen(false);
      setNewEmail("");
    }, 1500);
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
                      SU
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
                    defaultValue="Student User"
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

          {/* SECTION 2: Account Details (Specialized Workflows) */}
          <div className="space-y-8 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-lg font-semibold text-gray-900">
              <ShieldAlert size={20} className="text-red-600" />
              <h2>Account Details</h2>
            </div>

            <div className="space-y-6">
              {/* Personal Email Section */}
              <div className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Mail size={16} className="text-gray-500" />
                    Personal Email Address
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    student.user@example.com
                  </p>
                  <p className="mt-1 text-xs text-amber-600">
                    * Changing this will require you to verify your new email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(true)}
                  className="shrink-0 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                >
                  Update Email
                </button>
              </div>

              {/* Institution ID Section */}
              <div className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <User size={16} className="text-gray-500" />
                    Institution ID
                  </p>
                  <p className="mt-1 text-sm text-gray-500">10XXXXXX</p>
                  <p className="mt-1 text-xs text-red-600">
                    * A successful ID change request will log you out of your
                    current session.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsIdModalOpen(true)}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                >
                  Request ID Change
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Email Update Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Personal Email
              </h3>
              <button
                onClick={() => !isSubmittingModal && setIsEmailModalOpen(false)}
                className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEmailUpdateSubmit} className="p-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g., new.email@example.com"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500">
                  We will send a verification link to this address. You will
                  need to verify it before the change takes effect.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  disabled={isSubmittingModal}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingModal || !newEmail}
                  className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  {isSubmittingModal ? "Sending..." : "Send Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Institution ID Update Modal */}
      {isIdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Request Institution ID Change
              </h3>
              <button
                onClick={() => !isSubmittingModal && setIsIdModalOpen(false)}
                className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleIdChangeSubmit} className="p-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  New Institution ID
                </label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="e.g., 20XXXXXX"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  required
                />
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-xs text-red-800">
                    <strong>Warning:</strong> Upon successful submission and
                    approval of this request, you will be immediately logged out
                    of your current session.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsIdModalOpen(false)}
                  disabled={isSubmittingModal}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingModal || !newId}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  {isSubmittingModal ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
