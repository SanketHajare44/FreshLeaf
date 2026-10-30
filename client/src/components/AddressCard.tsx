import type { Dispatch, SetStateAction } from "react";
import type { Address } from "../types";
import { CheckIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface AddressCardProps {
  addr: Address;
  onEditHandler: (addr: Address) => void;
  setAddresses: Dispatch<SetStateAction<Address[]>>;
}

const AddressCard = ({
  addr,
  onEditHandler,
  setAddresses,
}: AddressCardProps) => {
  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmed) return;

    setAddresses((prevAddresses) => {
      const remainingAddresses = prevAddresses.filter(
        (address) => address._id !== id,
      );

      // If the default address was deleted, select another address
      // as the default when any addresses remain.
      const deletedAddress = prevAddresses.find(
        (address) => address._id === id,
      );

      if (deletedAddress?.isDefault && remainingAddresses.length > 0) {
        remainingAddresses[0] = {
          ...remainingAddresses[0],
          isDefault: true,
        };
      }

      return remainingAddresses;
    });
  };

  return (
    <div className="max-w-3xl bg-white rounded-2xl p-6 flex items-start justify-between gap-4">
      {/* Left: Address details */}
      <div className="flex gap-4 min-w-0">
        <div className="size-10 rounded-xl bg-app-cream flex-center shrink-0">
          <MapPinIcon className="size-5 text-app-green" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-app-green">{addr.label}</p>

            {addr.isDefault && (
              <span className="flex-center gap-1 px-2.5 py-0.5 text-[10px] font-medium bg-app-green text-white rounded-full">
                <CheckIcon className="size-3" />
                Default
              </span>
            )}
          </div>

          <p className="text-sm text-app-text-light break-words">
            {addr.address}, {addr.city}, <br />
            {addr.state}, {addr.zip}
          </p>
        </div>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEditHandler(addr)}
          className="p-2 text-app-text-light hover:text-app-green hover:bg-app-cream rounded-lg transition-colors"
          aria-label={`Edit ${addr.label} address`}
          title="Edit address"
        >
          <PencilIcon className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => handleDelete(addr._id)}
          className="p-2 text-app-text-light hover:text-app-error hover:bg-red-50 rounded-lg transition-colors"
          aria-label={`Delete ${addr.label} address`}
          title="Delete address"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
