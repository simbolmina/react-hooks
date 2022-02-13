import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = function (currHttpState, action) {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case 'RESPONSE':
      return {
        ...currHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('http reducer error');
  }
};

const useHttp = function () {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(function () {
    dispatchHttp({ type: 'CLEAR' });
  }, []);

  const sendRequest = useCallback(function (
    url,
    method,
    body,
    reqExtra,
    reqIdentifier
  ) {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
    fetch(url, {
      method: method,
      body: body,
      header: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        dispatchHttp({
          type: 'RESPONSE',
          responseData: responseData,
          extra: reqExtra,
        });
      })
      .catch(error => {
        // setError(error.message + 'Something went wrong');
        // setIsLoading(false);
        dispatchHttp({ type: 'ERROR', errorMessage: 'hata ' + error.message });
      });
  },
  []);
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear: clear,
  };
};

export default useHttp;
