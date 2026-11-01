import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { Address } from "../types";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Loading from "../components/Loading";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../config/api";

const Addresses = () => {
  const { user, updateUser } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>(user?.addresses ?? []);

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

  // Fetch actual addresses from the backend
  useEffect(() => {
    let isMounted = true;

    const fetchAddresses = async () => {
      try {
        const { data } = await api.get("/addresses");

        if (!isMounted) return;

        const fetchedAddresses: Address[] = data.addresses;

        setAddresses(fetchedAddresses);
        updateUser({ addresses: fetchedAddresses });
      } catch (err: unknown) {
        if (!isMounted) return;

        const message =
          err instanceof Error ? err.message : "Failed to load addresses";

        toast.error(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAddresses();

    return () => {
      isMounted = false;
    };
  }, []);

  // Get the user's current location
  const getLocation = (retries = 3): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      let attemptsRemaining = retries;

      const attempt = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (geoError) => {
            if (attemptsRemaining > 0) {
              attemptsRemaining--;

              window.setTimeout(attempt, 1000);
            } else {
              reject(
                new Error(geoError.message || "Failed to get your location"),
              );
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
          },
        );
      };

      attempt();
    });
  };

  // Add or update address using the existing API
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const coords = await getLocation();

      const payload = {
        ...form,
        ...coords,
      };

      const { data } = editingId
        ? await api.put(`/addresses/${editingId}`, payload)
        : await api.post("/addresses", payload);

      if (!Array.isArray(data.addresses)) {
        throw new Error(
          "The API response does not contain the updated addresses list",
        );
      }

      const updatedAddresses: Address[] = data.addresses;

      setAddresses(updatedAddresses);
      updateUser({ addresses: updatedAddresses });

      toast.success(
        editingId
          ? "Address updated successfully!"
          : "Address added successfully!",
      );

      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save address";

      toast.error(message);
    }
  };

  // Open the form with the selected address details
  const onEditHandler = (addr: Address) => {
    setForm({
      label: addr.label,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isDefault: addr.isDefault,
    });

    setEditingId(addr.id);
    setShowForm(true);
  };

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
                key={addr.id}
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
