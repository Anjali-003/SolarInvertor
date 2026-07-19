import { useEffect, useState } from "react";
import api from "../utils/api";
import "../styles/admin.css";

export default function PendingVendors() {


    console.log("PendingVendors rendered");


    const [vendors, setVendors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    async function fetchPendingVendors() {

        try {

            setLoading(true);

            setError("");

            const { data } = await api.get(

                "/admin/vendors/pending"

            );

            setVendors(data);

        }

        catch (err) {

            if (err.response) {

                setError(

                    err.response.data.error ||

                    "Failed to fetch vendors."

                );

            }

            else {

                setError(

                    "Unable to connect to server."

                );

            }

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        fetchPendingVendors();

    }, []);

    async function approveVendor(id) {

        try {

            const { data } = await api.post(

                `/admin/vendors/${id}/approve`

            );

            setMessage(data.message);

            fetchPendingVendors();

        }

        catch (err) {

            setError(
                err.response?.data?.error ||
                "Approval failed."
            );
        }

    }

    async function rejectVendor(id) {

        try {

            const { data } = await api.post(

                `/admin/vendors/${id}/reject`

            );

            setMessage(data.message);

            fetchPendingVendors();

        }

        catch (err) {

            setError(
                err.response?.data?.error ||
                "Rejection failed."
            );

        }

    }

    if (loading)

        return <h2>Loading...</h2>;

    if (error)

        return <h2>{error}</h2>;

    return (

        <>

            <h1 className="page-title">

                Pending Vendors

            </h1>

            <p className="page-subtitle">

                Review vendor registration requests.

            </p>

            {

                message &&

                <div

                    style={{

                        background: P.surfaceSuccess,

                        color: P.textSuccessMsg,

                        padding: 15,

                        borderRadius: 10,

                        marginBottom: 20

                    }}

                >

                    {message}

                </div>

            }

            <div className="card">

                {

                    vendors.length === 0 ?

                        <div className="empty">

                            No pending vendor requests.

                        </div>

                        :

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th>Name</th>

                                    <th>Email</th>

                                    <th>Phone</th>

                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    vendors.map((vendor) => (

                                        <tr key={vendor.id}>
                                            <td data-label="Name">{vendor.name}</td>
                                            <td data-label="Email">{vendor.email}</td>
                                            <td data-label="Phone">{vendor.phone}</td>
                                            <td data-label="Action">
                                                <div className="action-buttons">

                                                    <button

                                                        className="approve-btn"

                                                        onClick={() =>

                                                            approveVendor(vendor.id)

                                                        }

                                                    >

                                                        Approve

                                                    </button>

                                                    <button

                                                        className="reject-btn"

                                                        onClick={() =>

                                                            rejectVendor(vendor.id)

                                                        }

                                                    >

                                                        Reject

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                }

            </div>

        </>

    );

}