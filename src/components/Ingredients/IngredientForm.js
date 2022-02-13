import React, { useState } from 'react';
import LoadingIncidator from '../UI/LoadingIndicator';
import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  // const [inputState, setInputState] = useState({ title: '', amount: '' });
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  const titleHandler = function (event) {
    setEnteredTitle(event.target.value);
  };
  const amountHandler = function (event) {
    setEnteredAmount(event.target.value);
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={titleHandler}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={amountHandler}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIncidator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
