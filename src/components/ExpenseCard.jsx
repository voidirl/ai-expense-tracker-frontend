import { Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import "../styles/cards.css"

export default function ExpenseCard({ title, amount }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          width: 200,
          background: "linear-gradient(135deg,#4f46e5,#06b6d4)",
          color: "white",
        }}
      >
        <CardContent>
          <h4>{title}</h4>
          <h2>{amount}</h2>
        </CardContent>
      </Card>
    </motion.div>
  );
}