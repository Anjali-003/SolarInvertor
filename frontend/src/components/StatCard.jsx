import "../styles/statCard.css";

export default function StatCard({

    title,

    value,

    color = "blue"

}) {

    return (

        <div className={`stat-card ${color}`}>

            <div className="stat-title">

                {title}

            </div>

            <div className="stat-value">

                {value}

            </div>

        </div>

    );

}