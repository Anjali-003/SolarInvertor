import {
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import P from "../theme/colors";

export default function VendorFooter() {

  const navigate = useNavigate();
  const location = useLocation();

  // id from URL params (works on /vendor/device/:id/* routes)
  const { id: paramId } = useParams();

  // fallback: read from localStorage (works on /vendor route)
  const storedDevice = JSON.parse(
    localStorage.getItem("selectedVendorDevice") || "null"
  );

  const id = paramId || storedDevice?.id;

//   const navItems = [
//     {
//       label: "Fault",
//       path: `/vendor/device/${id}/fault`,
//     },
//     {
//       label: "Home",
//       path: "/vendor",
//     },
//     {
//       label: "Power",
//       path: `/vendor/device/${id}/power`,
//     },

const navItems = [
        {
            label: "Fault",
            path: `/vendor/device/${id}/fault`,
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 22 20 2 20 12 2" />
                    <line x1="12" y1="8" x2="12" y2="13" />
                    <circle cx="12" cy="17" r="1" />
                </svg>
            ),
        },
        {
            label: "Home",
            path: "/vendor",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10.5L12 3l9 7.5" />
                    <path d="M5 9.5V21h14V9.5" />
                </svg>
            ),
        },
        {
            label: "Power",
            path: `/vendor/device/${id}/power`,
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
        },
        
    ];

  return (
    <div
            style={{
                background: P.surface,
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: 68,
                boxShadow: P.shadowNav,
                borderTop: "1px solid ${P.border}",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                fontFamily: "'Inter', sans-serif",
            }}
        >

      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 3,
                            cursor: "pointer",
                            color: isActive ? P.amberDark : P.textLight,
                            transition: "0.2s",
                        }}
                    >

            {/* ICON */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </div>

            {/* LABEL */}
            <div style={{
                            fontSize: 11,
                            fontWeight: isActive ? 700 : 500,
                            fontFamily: "'Inter', sans-serif",
                        }}>

              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}