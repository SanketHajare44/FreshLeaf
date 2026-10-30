import type { Dispatch, FormEvent, SetStateAction } from "react";
import { XIcon } from "lucide-react";

interface AddressFormData {
  label: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

interface AddressFormProps {
  resetForm: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  form: AddressFormData;
  setForm: Dispatch<SetStateAction<AddressFormData>>;
  editingId: string | null;
}

const AddressForm = ({
  resetForm,
  handleSubmit,
  form,
  setForm,
  editingId,
}: AddressFormProps) => {
  return (
    <>
      {/* Modal overlay */}
      <div className="fixed inset-0 bg-black/40 z-50" aria-hidden="true" />

      {/* Modal container */}
      <div
        onClick={resetForm}
        className="fixed inset-0 z-50 flex-center p-4 overflow-y-auto"
      >
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 w-full max-w-lg animate-fade-in my-auto"
        >
          {/* Form header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-app-green">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>

            <button
              type="button"
              onClick={resetForm}
              className="p-2 hover:bg-app-cream rounded-lg transition-colors"
              aria-label="Close address form"
            >
              <XIcon className="size-5" />
            </button>
          </div>

          {/* Label */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="address-label"
                className="block text-sm font-medium text-app-green mb-1.5"
              >
                Label
              </label>

              <input
                id="address-label"
                type="text"
                placeholder="Home, Work, etc."
                required
                autoFocus
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                value={form.label}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    label: e.target.value,
                  }))
                }
              />
            </div>

            {/* Street address */}
            <div>
              <label
                htmlFor="street-address"
                className="block text-sm font-medium text-app-green mb-1.5"
              >
                Street Address
              </label>

              <input
                id="street-address"
                type="text"
                placeholder="Enter street address"
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </div>

            {/* City and state */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="address-city"
                  className="block text-sm font-medium text-app-green mb-1.5"
                >
                  City
                </label>

                <input
                  id="address-city"
                  type="text"
                  placeholder="Enter city"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                  value={form.city}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="address-state"
                  className="block text-sm font-medium text-app-green mb-1.5"
                >
                  State
                </label>

                <input
                  id="address-state"
                  type="text"
                  placeholder="Enter state"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                  value={form.state}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Zip code and default checkbox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="address-zip"
                  className="block text-sm font-medium text-app-green mb-1.5"
                >
                  Zip Code
                </label>

                <input
                  id="address-zip"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter zip code"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                  value={form.zip}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      zip: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                    className="accent-app-green"
                  />

                  <span className="text-sm text-app-text">Set as default</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="mt-6 w-full py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors"
          >
            {editingId ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddressForm;
