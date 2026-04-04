const BASE_URL = "https://expense-tracker-backend-production-03a4.up.railway.app/api/expenses";

export const getAllExpenses = async () => {
    const res = await fetch(BASE_URL);
    return res.json();
};

export const addExpense = async (expense) => {
    const res = await fetch(BASE_URL,{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(expense),
    });
    return res.json();
};

export const updateExpense = async(id,expense) => {
    const res = await fetch(`${BASE_URL}/${id}`,{
        method:"PUT",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(expense),
    });
    return res.json();
};

export const deleteExpense = async(id) => {
   await fetch (`${BASE_URL}/${id}`,{
    method:"DELETE"
   });
};

export const getTotalSum = async () => {
    const res = await fetch(`${BASE_URL}/total`);
    return res.json();
} ;

export const getByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/category/${category}`);
  return res.json();
};

export const getByDate = async (date) => {
  const res = await fetch(`${BASE_URL}/date/${date}`);
  return res.json();
};
