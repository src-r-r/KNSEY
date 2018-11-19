export const createCity = (city) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();
      const citiesRef = firestore.collection('cities');

      citiesRef.where('cityName', '==', city.cityName).get()
      .then(snapshot => {
         if(snapshot.empty) {
            firestore.collection('cities').add({
               ...city
            })
            .then(() => {
               dispatch({ type: 'CREATE_CITY', city });
            })
            .catch((err) => {
               dispatch({ type: 'CREATE_CITY_ERROR', err })
            })
         }
       })
       .catch(err => {
         console.log('Error getting documents', err);
       });
   }
};

export const getCity = (cityName) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();
      const citiesRef = firestore.collection('cities');

      citiesRef.where('cityName', '==', cityName).get()
      .then(snapshot => {
         if(!snapshot.empty){
            const city = snapshot.docs[0].data()
            city["cityId"] = snapshot.docs[0].id
            dispatch({ type: 'GET_CITY_SUCCESS', city });
         }
         else{
            dispatch({ type: 'CITY_NOT_FOUND' });
         }
       })
       .catch(err => {
         console.log('Error getting documents', err);
         dispatch({ type: 'GET_CITY_ERROR', err });
       });
   }
};