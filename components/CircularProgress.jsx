import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SecurityHealth = ({score}) => {
  return (
     <div className="w-48 h-48 mb-4">
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
            pathColor: 
            score >= 80 ? "#10b981" :
            score >= 60 ? "#3b82f6" :
            score >= 40 ? "#eab308" : "#ef4444",
            textColor: "#ffffff",
            trailColor: "#1f2937",
            textSize: "24px",
            pathTransitionDuration: 1.5,
        })}
        strokeWidth={8}
     />
    </div>
  );
};

export default SecurityHealth;
