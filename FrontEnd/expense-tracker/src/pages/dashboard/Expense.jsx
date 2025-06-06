import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../Components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../Components/Expense/ExpenseOverview";
import toast from "react-hot-toast";
import { API_PATHS } from "../../utils/apiPaths";
import AddExpenseForm from "../../Components/Expense/AddExpenseForm";
import Modal from "../../Components/Modal";
import ExpenseList from "../../Components/Expense/ExpenseList";
import DeleteAlert from "../../Components/DeleteAlert";

const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response?.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
      toast.error("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category.trim()) {
      toast.error("Category is Required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than zero.");
      return;
    }
    if (!date) {
      toast.error("Date is Required.");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      setOpenAddExpenseModal(false);
      toast.success("Expense Added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error Adding Expense:", error.response?.data?.message || error.message);
      toast.error("Failed to add expense.");
    }
  };
  const deleteExpense = async (id) => {
     try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show:false,data:null});
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
     } catch(error)
     {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message|| error.message
      );
     }
  };

  const handleDownloadExpenseDetails = async () => {
    try{
      const response=await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {responseType:"blob",}
      );
      const url=window.URL.createObjectURL(new Blob([response.data]));
      const link=document.createElement("a");
      link.href=url;
      link.setAttribute("download","expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    }catch(error)
    {
      console.error("Error Downloading Expense Details:",error);
      toast.error("Failure To Download Expense details.Please Try Again.")
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList
           transactions={expenseData}
           onDelete={(id)=>{
            setOpenDeleteAlert({show:true,data:id});
           }}
           onDownload={handleDownloadExpenseDetails}
           />
        </div>
        <Modal 
         isOpen={openAddExpenseModal}
         onClose={()=>setOpenAddExpenseModal(false)}
         title="Add Expense"
         >
          <AddExpenseForm onAddExpense={handleAddExpense}/>
         </Modal>
         <Modal
         isOpen={openDeleteAlert.show}
         onClose={()=>setOpenDeleteAlert({show:false,data:null})}
         title="Delete Expense"
         >
          <DeleteAlert
           content="Are you sure you want to delete this expense details"
           onDelete={()=>deleteExpense(openDeleteAlert.data)}
           />
         </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
