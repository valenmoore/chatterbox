import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { languageSpeedData } from "../../../constants/constants";
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../../firebase";
import useFirebaseAuth from "../../../hooks/useAuth";
import Pin from "../../svgs/Pin";

const Recap = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;
    const { userMessageStats, messages, wordUniqueness, mostCommonWords, languageName, convoIndex, speed } = state || {};
    const [averageStats, setAverageStats] = useState({});
    const [topTranslatedWords, setTopTranslatedWords] = useState([]);
    const [hasSetStats, setHasSetStats] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [understandingIndex, setUnderstandingIndex] = useState(5);
    const [understandingSent, setUnderstandingSent] = useState(false);
    const userProfile = useFirebaseAuth();
    const { index } = useParams();
    const sliderPadding = 150;
    const understandingSentences = ["So lost.", "Not a clue.", "Got a few words?", "Bits and pieces.", "Sort of with it.", "Got the gist.", "Following along.", "Pretty much got it.", "Almost perfectly.", "Perfect!"]

    const sortObjKeys = obj => {
        return Object.keys(obj).sort(function(a,b){return obj[b] - obj[a]});
    }

    const setData = async (wpm, speed, userDoc) => {
        if (!hasSetStats && userProfile.user?.uid !== undefined) {
          try {
            const docSnap = await getDoc(userDoc);
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.saves[index].averages.wpms.length === convoIndex) {
                // make sure you havent updated already
                const save = data.saves[index];
                save.averages.wpms = [...save.averages.wpms, wpm]
                save.averages.speeds = [...save.averages.speeds, speed];
          
                const updatedSaves = [...data.saves]; // Clone the array
                updatedSaves[index] = save; // Update the specific save at index
                console.log(updatedSaves);
                
                // Update the document in Firestore
                await updateDoc(userDoc, {
                  saves: updatedSaves,
                  practicedToday: true
                });
              }
            } else {
              console.error("No such document!");
              return null;
            }
          } catch (error) {
            console.error("Error adding save: ", error);
          }
            setHasSetStats(true);
        }
    }

    const setUnderstanding = async (understanding, userDoc) => {
      if (userProfile.user?.uid !== undefined) {
        try {
          const docSnap = await getDoc(userDoc);
          if (data.saves[index].averages.understandings.length === convoIndex) {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const save = data.saves[index];
              save.averages.understandings = [...save.averages.understandings, understanding];
        
              const updatedSaves = [...data.saves]; // Clone the array
              updatedSaves[index] = save; // Update the specific save at index
              console.log(updatedSaves);
              
              // Update the document in Firestore
              await updateDoc(userDoc, {
                saves: updatedSaves,
                practicedToday: true
              });
            } else {
              console.error("No such document!");
              return null;
            }
          }
        } catch (error) {
          console.error("Error adding save: ", error);
        }
      }
  }

    const getDocData = async docRef => {
        const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log("Failed to find user data");
                return null;
            }
    }

    const getTopTranslatedWords = () => {
        const translations = userMessageStats.translations;
        for (const k of Object.keys(translations)) {
            if (k.split("").length <= 3) delete translations[k];
        }
        console.log(translations)
        const sortedKeys = sortObjKeys(translations);
        const translatedWords = []
        for (let i = 0; i < 3; i++) {
            if (translations[sortedKeys[i]] > 0) translatedWords.push({word: sortedKeys[i], count: translations[sortedKeys[i]]});
        }
        setTopTranslatedWords(translatedWords);
    }

    const getAverageWpm = wpms => {
      let sum = 0;
      wpms = wpms.filter(w => w !== undefined);
      wpms.forEach(w => {
          sum += w;
      });
      return sum / wpms.length;
    }

    const getStats = async () => {
      console.log(userMessageStats)
      let wpm = Math.round(getAverageWpm(userMessageStats.messageStats.map(m => m.wpm)));
      if (isNaN(wpm)) wpm = 150;
      let targetWpm = languageSpeedData[languageName];
      if (targetWpm === undefined) targetWpm = 200 // default value

      const docRef = doc(db, "users", userProfile.user?.uid);
      setData(wpm, speed, docRef);
      const userStats = (await getDocData(docRef)).saves[index].averages;
      const avgWpm = getAverageWpm(userStats.wpms);
      setAverageStats({wpm, targetWpm, avgWpm});

      getTopTranslatedWords();
      setIsLoading(false);
    }

    useEffect(() => {
      if (state === null) navigate("/dashboard");
      if (!userProfile.isLoading) {
        getStats();
      }
    }, [userProfile.isLoading])

    const calculateSliderPosition = (wpm, targetWpm, padding=sliderPadding) => {
        const dif = (wpm - targetWpm);
        const pos = 50 + ((dif / (padding * 2)) * 100);
        if (pos > 100) return 100;
        if (pos < 0) return 0;
        return pos;
    }

    const sendUnderstanding = async () => {
      const docRef = doc(db, "users", userProfile.user?.uid);
      setUnderstanding(understandingIndex, docRef);
      setUnderstandingSent(true);
    }

    return (
        <>
          {userProfile.isLoading || isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="recap-info">
              <div className="header">
                <div className="blank"></div>
                <h1>Conversation complete!</h1>
                <button className="back-btn" onClick={() => navigate('/saves/' + index)}>Back to dashboard</button>
              </div>
              <div>
                <div>Conversation length: <div className="bolded">{messages.length}</div> chats</div>
              </div>
              <div className="wpm-section">
                <h3>Stats:</h3>
                <div>Your WPM: <div className="bolded">{averageStats.wpm}</div></div>
                <div>Your average WPM: <div className="bolded">{Math.round(averageStats.avgWpm)}</div></div>
                <div>Target WPM: <div className="bolded">{averageStats.targetWpm}</div></div>
                <div className="slider-wrapper">
                  <div className="pins">
                    <div className="target-marker marker"><Pin /></div>
                    <div className="user-marker marker" style={{ left: `${calculateSliderPosition(averageStats.wpm, averageStats.targetWpm)}%` }}>
                      <Pin />
                    </div>
                    <div className="user-avg-marker marker" style={{ left: `${calculateSliderPosition(averageStats.avgWpm, averageStats.targetWpm)}%` }}>
                      <Pin />
                    </div>
                  </div>
                  <div className="wpm-slider"></div>
                  <div className="labels">
                    <div>{averageStats.targetWpm - sliderPadding}</div>
                    <div>{averageStats.targetWpm + sliderPadding}</div>
                  </div>
                </div>
                <div className="words">
                    <div>
                        <div>You used </div><div className="bolded">{wordUniqueness.numUnique}</div><div> unique words.</div>
                    </div>
                    <div>
                        <div className="bolded">{Math.round(wordUniqueness.percent)}%</div>
                        <div> of the words that you used were unique.</div>
                    </div>
                    <div className="slider-wrapper">
                        <div className="pins">
                            <div className="target-marker marker"><Pin /></div>
                            <div className="user-marker marker" style={{ left: `${calculateSliderPosition(wordUniqueness.percent, 50, 50)}%` }}>
                                <Pin />
                            </div>
                            <div className="user-avg-marker marker" style={{ left: `${calculateSliderPosition(averageStats.avgWpm, averageStats.targetWpm)}%` }}>
                                <Pin />
                            </div>
                        </div>
                        <div className="wpm-slider"></div>
                        <div className="labels">
                            <div>0</div>
                            <div>100</div>
                        </div>
                    </div>
                </div>
              </div>
              {topTranslatedWords.length > 0 ? (<div className="translations">
                <h3>Top translations:</h3>
                {topTranslatedWords.map((obj, index) => (
                  <div key={index}>{obj.word}: {obj.count} times</div>
                ))}
              </div>) : <h3>No translations!</h3>}
              {!understandingSent && (<div className="understanding">
                <div>How would you rate your comprehension of this conversation?</div>
                <input type="range" min={0} max={9} value={understandingIndex} step={1} onChange={e => setUnderstandingIndex(e.target.value)} />
                <div className="understanding-sentence">{understandingSentences[understandingIndex]}</div>
                <button onClick={sendUnderstanding}>Submit</button>
              </div>)}
            </div>
          )}
        </>
      );      
}

export default Recap;