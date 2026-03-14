const BASE_URL = "http://localhost:8080/api/expenses";

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