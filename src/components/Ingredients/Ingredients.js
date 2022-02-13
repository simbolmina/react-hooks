import React, { useCallback, useEffect, useMemo, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../hooks/http';

const ingredientReducer = function (curentingredient, action) {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...curentingredient, action.ingredient];
    case 'DELETE':
      return curentingredient.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there');
  }
};

// const httpReducer = function (currHttpState, action) {
//   switch (action.type) {
//     case 'SEND':
//       return { loading: true, error: null };
//     case 'RESPONSE':
//       return { ...currHttpState, loading: false };
//     case 'ERROR':
//       return { loading: false, error: action.errorMessage };
//     case 'CLEAR':
//       return { ...currHttpState, error: null };
//     default:
//       throw new Error('http reducer error');
//   }
// };

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();
  //useHttp recap 444-446 dersleri arasinda anlatildi. karisik konu

  // const [httpState, dispatchHttp] = useReducer(httpReducer, {
  //   loading: false,
  //   error: null,
  // });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  // removed this because search component fetches data already

  // useEffect(() => {
  //   fetch(
  //     'https://react-recap-2a495-default-rtdb.firebaseio.com/ingredients.json'
  //   )
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(data => {
  //       console.log(data);
  //       const loadedIngredients = [];

  //       for (const key in data) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: data[key].title,
  //           amount: data[key].amount,
  //         });
  //       }
  //       setUserIngredients(loadedIngredients);
  //     });
  // }, []);

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra } });
    }
  }, [data, reqExtra, reqIdentifier]);

  const addIngredientHandler = useCallback(
    ingredient => {
      sendRequest(
        'https://react-recap-2a495-default-rtdb.firebaseio.com/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      );
      // setIsLoading(true);
      // dispatchHttp({ type: 'SEND' });
      // fetch(
      //   'https://react-recap-2a495-default-rtdb.firebaseio.com/ingredients.json',
      //   {
      //     method: 'POST',
      //     body: JSON.stringify(ingredient),
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // )
      //   .then(response => {
      //     dispatchHttp({ type: 'RESPONSE' });
      //     // setIsLoading(false);
      //     return response.json();
      //   })
      //   .then(data => {
      //     // setUserIngredients(prevIngredients => [
      //     //   ...prevIngredients,
      //     //   { id: data.name, ...ingredient },
      //     // ]);
      //     dispatch({ type: 'ADD', ingredient: { id: data.name, ...ingredient } });
      //   });
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    ingredientId => {
      sendRequest(
        `https://react-recap-2a495-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      );
      // setIsLoading(true);
      // dispatchHttp({ type: 'SEND' });
      // fetch(
      //   `https://react-recap-2a495-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      //   { method: 'DELETE' }
      // )
      //   .then(response => {
      //     // setIsLoading(false);

      //     dispatchHttp({ type: 'RESPONSE' });
      //     // setUserIngredients(prevIngredients =>
      //     //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      //     // );
      //     dispatch({ type: 'DELETE', id: ingredientId });
      //   })
      //   .catch(error => {
      //     // setError(error.message + 'Something went wrong');
      //     // setIsLoading(false);
      //     dispatchHttp({ type: 'ERROR', errorMessage: 'hata ' + error.message });
      //   });
    },
    [sendRequest]
  );

  const filteredIngredientsHandler = useCallback(function (
    filteredIngredients
  ) {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  },
  []);

  const clearError = useCallback(function () {
    // setError(null);
    // dispatchHttp({ type: 'CLEAR' });
    clear();
  }, []);

  const ingredientList = useMemo(() => {
    //memorize values and only renders when values changes
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
