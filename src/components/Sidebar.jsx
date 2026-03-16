import { FaHome, FaChartPie, FaRobot, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/sidebar.css"

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={{color:"white"}}>Expense AI</h2>

      <Link style={styles.link} to="/">
        <FaHome/> Dashboard
      </Link>

      <Link style={styles.link} to="/analytics">
        <FaChartPie/> Analytics
      </Link>

      <Link style={styles.link} to="/ai">
        <FaRobot/> AI Advisor
      </Link>

      <Link style={styles.link} to="/add">
        <FaPlus/> Add Expense
      </Link>
    </div>
  );
}

const styles = {
  sidebar:{
    width:"220px",
    height:"100vh",
    background:"#020617",
    display:"flex",
    flexDirection:"column",
    padding:"20px",
    gap:"20px"
  },

  link:{
    color:"white",
    textDecoration:"none",
    fontSize:"18px"
  }
};