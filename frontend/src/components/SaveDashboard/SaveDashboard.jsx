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
    const [comprehensionScores, setComprehensionScores] = useState([]);
    const [isMCRCollapsed, setIsMCRCollapsed] = useState(false);
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

    const mapRange = (value, inMin, inMax, outMin, outMax) => {
      return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    const getComprehensionScore = (speed, comprehension) => {
      const maxScore = 100;
      const score = ((speed + comprehension) / 20) * maxScore;
      return Math.round(score); // Rounding the result
    }

    useEffect(() => {
      if (currentSave) {
        const understandingScores = [];
        for (let i = 0; i < currentSave.averages.understandings.length; i++) {
          const understanding = currentSave.averages.understandings[i]; // 1-10
          const speed = mapRange(currentSave.averages.speeds[i], 0.25, 2, 1, 10); // 1-10
          const understandingScore = getComprehensionScore(speed, understanding); // 1-100
          understandingScores.push(understandingScore);
        }
        setComprehensionScores(understandingScores);
      }
    }, [currentSave])

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
                    <div className="content">
                      <h2><span>Current streak: </span><span className="bolded">{currentSave?.streak}</span></h2>
                      <div className="charts">
                        <div className="chart">
                          <h3>WPM over time:</h3>
                          <div className="chart-container">
                            <LineChart data={currentSave.averages.wpms.map((w, i) => {return {x: i, y: w}})} />
                          </div>
                          <div><span>Average WPM: </span><span className="bolded">{getAvgStat("wpms")}</span></div>
                        </div>
                        <div className="chart">
                          <h3><span className="colorful">Comprehension Score</span> over time:</h3>
                          <div className="chart-container">
                            <LineChart data={comprehensionScores.map((w, i) => {return {x: i, y: w}})} forceMin={0} forceMax={100} />
                          </div>
                          <div><span>Average Comprehension Score: </span><span className="bolded">{isNaN(average(comprehensionScores)) ? "-" : Math.round(average(comprehensionScores))}</span></div>
                        </div>
                      </div>
                      <div className="most-common-words">
                        <div className="mcw-header">
                          <h3>Words Used</h3>
                          <img onClick={() => setIsMCRCollapsed(prev => !prev)} style={{transition: "1s", transform: `scaleY(${isMCRCollapsed ? '-1' : '1'})`}} src="/down-arrow.svg" />
                        </div>
                        <div className={isMCRCollapsed ? "boxes hidden" : "boxes"}>
                          {Object.keys(currentSave.mostCommonWords)
                            .sort((a, b) => currentSave.mostCommonWords[b] - currentSave.mostCommonWords[a])
                            .map((word, i) => {
                              const count = currentSave.mostCommonWords[word]
                              return (
                                <div className="word-box" key={i}><span className="word">{word}</span><span>: </span><span>{count} </span><span>{count === 1 ? "time." : "times."}</span></div>
                              )
                          })}
                        </div>
                      </div>
                    </div>
                </div>
            </>
          )}
        </>
    );
}

export default SaveDashboard;