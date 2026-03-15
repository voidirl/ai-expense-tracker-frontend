import { FaBell, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import "../styles/navbar.css"

export default function Navbar() {
  return (
    <div style={styles.navbar}>

      <h2 style={styles.logo}>Smart Expense Tracker</h2>

      <input
        type="text"
        placeholder="Search..."
        style={styles.search}
      />

      <div style={styles.icons}>

        <motion.div whileHover={{ scale: 1.2 }}>
          <FaBell size={22} />
        </motion.div>

        <motion.div whileHover={{ scale: 1.2 }}>
          <FaUserCircle size={26} />
        </motion.div>

      </div>

    </div>
  );
}

const styles = {

  navbar: {
    height: "60px",
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    color: "white",
    borderBottom: "1px solid #1e293b"
  },

  logo: {
    fontSize: "20px"
  },

  search: {
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    width: "250px"
  },

  icons: {
    display: "flex",
    gap: "15px",
    cursor: "pointer"
  }
};