import { useRef, useState } from "react";
import StatCard from "../components/StatCard";
import api from "../utils/api";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";

import "../styles/admin.css";
import "../styles/UploadIMEI.css";

export default function UploadIMEI() {

    const inputRef = useRef(null);

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [result, setResult] = useState(null);


    function validateFile(selectedFile) {

        if (!selectedFile) return false;

        const allowedExtensions = [

            "xlsx",

            "xls"

        ];

        const extension =
            selectedFile.name
                .split(".")
                .pop()
                .toLowerCase();

        if (

            !allowedExtensions.includes(extension)

        ) {

            setError(

                "Only Excel (.xlsx or .xls) files are allowed."

            );

            return false;

        }

        const maxSize = 10 * 1024 * 1024;

        if (

            selectedFile.size > maxSize

        ) {

            setError(

                "Maximum file size is 10 MB."

            );

            return false;

        }

        setError("");

        setFile(selectedFile);

        return true;

    }

    function handleFile(e) {

        if (

            e.target.files.length === 0

        ) return;

        validateFile(

            e.target.files[0]

        );

    }
    


    async function uploadFile() {

        if (!file) {

            setError("Please choose an Excel file.");

            return;

        }

        setLoading(true);

        setError("");

        setSuccess("");

        setResult(null);

        try {

            const formData = new FormData();

            formData.append("file", file);

            const { data } = await api.post(

                "/admin/upload-imei",

                formData,

                {

                    headers: {

                        "Content-Type":

                            "multipart/form-data"

                    }

                }

            );

            setResult(data);

            setSuccess("IMEIs uploaded successfully.");

            setFile(null);

            
        }

        catch (err) {

            if (err.response) {

                setError(

                    err.response.data.error ||

                    "Upload failed."

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

    if (loading)

        return <Loading />;

    return (

        <>

            <h1 className="page-title">

                Upload IMEI Excel

            </h1>

            <p className="page-subtitle">

                Upload an Excel file containing valid 15-digit IMEIs.

            </p>

            <ErrorMessage

                message={error}

            />

            <SuccessMessage

                message={success}

            />

            <div className="upload-card">

    <h2>Select Excel File</h2>

    <p className="upload-description">

        Upload an Excel (.xlsx or .xls) file containing valid 15-digit IMEIs.

    </p>

    <input

        ref={inputRef}

        type="file"

        accept=".xlsx,.xls"

        onChange={handleFile}

    />

    {

        file && (

            <div className="selected-file">

                Selected File:

                <strong>

                    {file.name}

                </strong>

            </div>

        )

    }

    <button

        className="upload-btn"

        onClick={uploadFile}

        disabled={!file || loading}

    >

        {

            loading

                ? "Uploading..."

                : "Upload IMEIs"

        }

    </button>

</div>

            {

                result && (

                    <>

                        <div className="summary-card">

                            <h2>

                                Upload Summary

                            </h2>

                            <div className="summary-grid">

                                <div className="summary-grid">

                                    <StatCard
                                        title="Inserted"
                                        value={result.inserted}
                                        color="green"
                                    />

                                    <StatCard
                                        title="Already Exists"
                                        value={result.alreadyInDatabase}
                                        color="blue"
                                    />

                                    <StatCard
                                        title="Invalid IMEIs"
                                        value={result.invalidIMEIs}
                                        color="red"
                                    />

                                    <StatCard
                                        title="Duplicate In Excel"
                                        value={result.duplicateInExcel}
                                        color="yellow"
                                    />

                                </div>
                            </div>

                        </div>

                        <div className="lists-container">

                            <ResultList

                                title="Invalid IMEIs"

                                items={result.invalidList}

                            />

                            <ResultList

                                title="Already Existing"

                                items={result.existingList}

                            />

                            <ResultList

                                title="Duplicate In Excel"

                                items={result.duplicateInExcelList}

                            />

                        </div>

                    </>

                )

            }

        </>

    );

}

function ResultList({

    title,

    items

}) {

    return (

        <div className="result-card">

            <h3>

                {title}

            </h3>

            {

                items.length === 0 ?

                    <p>

                        None

                    </p>

                    :

                    <ul>

                        {

                            items.map(

                                (item, index) => (

                                    <li key={index}>

                                        {item}

                                    </li>

                                )

                            )

                        }

                    </ul>

            }

        </div>

    );

}