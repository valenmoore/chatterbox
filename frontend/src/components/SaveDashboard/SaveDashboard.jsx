import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import useFirebaseAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { languageMap } from "../../constants/constants";
import LineChart from "../LineChart/LineChart";

const SaveDashboard = () => {
    const { index } = useParams();
    const [currentSave, setCurrentSave] = useState(null);
    const userProfile = useFirebaseAuth();
    const navigate = useNavigate();

    const getSaveByIndex = async (index) => {
        if (userProfile.user?.uid !== undefined) {
            try {
                const userDoc = doc(db, "users", userProfile.user?.uid);
                const docSnap = await getDoc(userDoc);
                
                if (docSnap.exists()) {
                  const data = docSnap.data();
                  const saves = data.saves || [];
                  console.log(saves);
                  
                  if (index >= 0 && index < saves.length) {
                    return saves[index]; // Return the save at the specified index
                  } else {
                    console.error("Index out of bounds");
                    return null;
                  }
                } else {
                  console.error("No such document!");
                  return null;
                }
            } catch (error) {
                console.error("Error getting document: ", error);
            }
        }
    }

    const fetchSave = async () => {
        const save = await getSaveByIndex(index);
        setCurrentSave(save);
    }

    const newConversation = () => {
        navigate("/saves/" + index + "/conversation-settings", { state: { languageName: currentSave.language }})
    }

    useEffect(() => {
        fetchSave();
    }, [userProfile.isLoading])

    const getAvgStat = stat => {
        let sum = 0;
        if (currentSave.averages[stat].length === 0) return "-";
        for (const val of currentSave.averages[stat]) {
            sum += val;
        }
        sum /= currentSave.averages[stat].length;
        return Math.round(sum);
    }

    return (
        <>
          {currentSave === undefined || currentSave === null ? (
            <div>Loading...</div>
          ) : (
            <>
                <div className="save-dashboard">
                    <div className="header">
                      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
                      <h2>Save #{Number(index) + 1}: {languageMap[currentSave?.language]?.full}</h2>
                      <button onClick={newConversation}>New Conversation</button>
                    </div>
                    <div><span>Current streak: </span><span className="bolded">{currentSave?.streak}</span></div>
                    <div><span>Average WPM: </span><span className="bolded">{getAvgStat("wpms")}</span></div>
                    <div className="chart-container">
                      <LineChart data={currentSave.averages.wpms.map((w, i) => {return {x: i, y: w}})} />
                    </div>
                </div>
            </>
          )}
        </>
    );
}

export default SaveDashboard;