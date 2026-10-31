import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { Address } from "../types";
import { dummyAddressData } from "../data/assets";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Loading from "../components/Loading";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";

const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>(dummyAddressData);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  // Reset form and close modal
  const resetForm = () => {
    setForm({
      label: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });

    setShowForm(false);
    setEditingId(null);
  };

  // Add or update address
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingId) {
      // Update existing address
      setAddresses((prevAddresses) =>
        prevAddresses.map((addr) => {
          if (addr._id === editingId) {
            return {
              ...addr,
              ...form,
            };
          }

          // Ensure only one address is the default
          if (form.isDefault) {
            return {
              ...addr,
              isDefault: false,
            };
          }

          return addr;
        }),
      );
    } else {
      // Add a new address
      const newAddress: Address = {
        ...form,
        _id: crypto.randomUUID(),
        lat: 0,
        lng: 0,
      };

      setAddresses((prevAddresses) => {
        const updatedAddresses = form.isDefault
          ? prevAddresses.map((addr) => ({
              ...addr,
              isDefault: false,
            }))
          : prevAddresses;

        return [...updatedAddresses, newAddress];
      });
    }

    resetForm();
  };

  // Open the form with selected address details
  const onEditHandler = (addr: Address) => {
    setForm({
      label: addr.label,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isDefault: addr.isDefault,
    });

    setEditingId(addr._id);
    setShowForm(true);
  };

  // Hide loading indicator
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-app-green">
            My Addresses
          </h1>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2"
          >
            <PlusIcon className="size-4" />
            Add Address
          </button>
        </div>

        {/* Address form modal */}
        {showForm && (
          <AddressForm
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            form={form}
            setForm={setForm}
            editingId={editingId}
          />
        )}

        {/* Address list */}
        {loading ? (
          <Loading />
        ) : addresses.length === 0 ? (
          <div className="text-center py-16">
            <MapPinIcon className="size-16 text-app-border mx-auto mb-4" />

            <h2 className="text-lg font-semibold text-app-green mb-2">
              No addresses saved
            </h2>

            <p className="text-sm text-app-text-light">
              Add an address for faster checkout
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <AddressCard
                key={addr._id}
                addr={addr}
                onEditHandler={onEditHandler}
                setAddresses={setAddresses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
