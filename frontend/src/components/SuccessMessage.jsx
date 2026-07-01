import "../styles/common.css";

export default function SuccessMessage({ message }) {

    if (!message) return null;

    return (

        <div className="success-message">

            ✅ {message}

        </div>

    );

}