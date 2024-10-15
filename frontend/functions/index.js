const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require('firebase-admin');
admin.initializeApp();

// Schedule the function to run every day at midnight (using UTC time)
exports.scheduledFunction = onSchedule('every day 00:00', {
  timeZone: 'America/New_York'
}, async (context) => {
    const firestore = admin.firestore();
    const collectionRef = firestore.collection('users'); // replace 'users' with your collection's name

    try {
        // Fetch all documents in the collection
        const snapshot = await collectionRef.get();

        if (snapshot.empty) {
            console.log('No matching documents.');
            return null;
        }

        // Use batch to update multiple documents
        const batch = firestore.batch();
        snapshot.forEach(doc => {
            const docData = doc.data();  
            const docRef = doc.ref;     

            // Modify the document data
            const modifiedData = { ...docData };
            for (let i = 0; i < modifiedData.saves.length; i++) {
                if (modifiedData.saves[i].practicedToday) modifiedData.saves[i].streak++;
                else modifiedData.saves[i].streak = 0;

                modifiedData.saves[i].practicedToday = false;
            }

            // Add the document update to the batch
            batch.set(docRef, modifiedData);
        });

        // Commit the batch update
        await batch.commit();
        console.log('All documents updated successfully.');

    } catch (error) {
        console.error('Error updating documents:', error);
    }

    return null;
});