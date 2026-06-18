import "./Finance.css";
import { useData } from "../context/DataContext";

import React, {
  useState,
  useEffect
} from "react";

import { Trash2, CalendarDays, IndianRupee } from "lucide-react";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../Firebase";
import FinanceSkeleton from "../components/Skeleton/FinanceSkeleton";

export default function Finance() {

  const { financeData, setFinanceData } = useData();

  const [months, setMonths] =
    useState(financeData?.months || []);

  const [transactions, setTransactions] =
    useState(financeData?.transactions || []);

  const [selectedMonth, setSelectedMonth] =
    useState(null);

  const [showMonthModal, setShowMonthModal] =
    useState(false);

  const [showAddModal, setShowAddModal] =
    useState(false);

    const [showDeleteModal,
  setShowDeleteModal] =
  useState(false);

  const [showMonthMenu,
  setShowMonthMenu] =
  useState(false);

    const [amount, setAmount] =
  useState("");

const [note, setNote] =
  useState("");

  const [transactionType, setTransactionType] =
  useState("expense");

  const [expandedDates, setExpandedDates] =
  useState([]);

  const [showCreateMonth, setShowCreateMonth] =
  useState(false);

const [monthName, setMonthName] =
  useState("");

const [openingBalance, setOpeningBalance] =
  useState("");

const [loading, setLoading] = useState(!financeData);

const [date, setDate] =
  useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );
    
 const loadTransactions = async () => {
  const snapshot = await getDocs(collection(db, "financeTransactions"));
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setTransactions(data);
  setFinanceData(prev => ({ ...prev, transactions: data }));
};

const createMonth = async () => {

  if (
    !monthName ||
    !openingBalance
  ) return;

  const [year, month] =
    monthName.split("-");

  const displayMonth =
    new Date(
      Number(year),
      Number(month) - 1
    ).toLocaleString(
      "default",
      {
        month: "long",
        year: "numeric"
      }
    );

  await addDoc(
    collection(
      db,
      "financeMonths"
    ),
    {
      monthName:
        displayMonth,

      monthKey:
        monthName,

      openingBalance:
        Number(
          openingBalance
        ),

      createdAt:
        Date.now()
    }
  );

  setMonthName("");
  setOpeningBalance("");

  setShowCreateMonth(false);

  loadMonths();
};

const saveTransaction =
  async () => {

  if (!amount) return;

  const monthKey =
    date.slice(0, 7);

  await addDoc(
    collection(
      db,
      "financeTransactions"
    ),
    {
      monthKey,
      date,
      amount: Number(amount),
      type: transactionType,
      note,
      createdAt:
        Date.now()
    }
  );

  setAmount("");
  setNote("");
  setTransactionType(
  "expense"
);
  setShowAddModal(false);
  loadTransactions();
};

const confirmDeleteMonth = async () => {

  console.log("DELETE CLICKED");

  console.log(selectedMonth);

  setShowDeleteModal(false);

  try {

    await deleteDoc(
      doc(
        db,
        "financeMonths",
        selectedMonth.id
      )
    );

    console.log("MONTH DELETED");

  } catch (err) {

    console.error(err);

  }

};

const deleteTransaction =
  async (id) => {

  if (
    !window.confirm(
      "Delete expense?"
    )
  ) return;

  await deleteDoc(
    doc(
      db,
      "financeTransactions",
      id
    )
  );

  loadTransactions();
};

  const loadMonths = async () => {
  setLoading(true);
  const snapshot = await getDocs(collection(db, "financeMonths"));
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setMonths(data);
  // save combined finance data to context after both loads
  setFinanceData(prev => ({ ...prev, months: data }));
  setLoading(false);
};

  const monthTransactions =
  selectedMonth
    ? transactions.filter(
        (t) =>
          t.monthKey ===
          selectedMonth.monthKey
      )
    : [];

    let runningBalance =
  Number(
    selectedMonth?.openingBalance || 0
  );

const groupedTransactions =
  Object.values(

    monthTransactions.reduce(
      (acc, transaction) => {

        const date =
          transaction.date;

        if (!acc[date]) {

          acc[date] = {
  date,
  total: 0,
  entries: []
};

        }

if (
  transaction.type ===
  "expense"
) {

  acc[date].total +=
    Number(
      transaction.amount
    );

} else {

  acc[date].total -=
    Number(
      transaction.amount
    );
}
     acc[date].entries.push({
  note: transaction.note,
  amount: transaction.amount,
  type: transaction.type,
  id: transaction.id
});

        return acc;

      },
      {}
    )

  )
  .sort(
    (a, b) =>
      new Date(a.date) -
      new Date(b.date)
  )
  .map((item) => {

    runningBalance -=
      item.total;

    return {
      ...item,
      balance: runningBalance
    };

  });

  const currentBalance =
  groupedTransactions.length > 0
    ? groupedTransactions[
        groupedTransactions.length - 1
      ].balance
    : Number(
        selectedMonth
          ?.openingBalance || 0
      );

          const openAddModal = () => {

  setTransactionType("expense");

  setAmount("");

  setNote("");

  setDate(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  setShowAddModal(true);
};

useEffect(() => {
  if (!financeData) {
    loadMonths();
    loadTransactions();
  }
}, []);

useEffect(() => {

  if (
    showMonthModal ||
    showAddModal
  ) {

    document.body.style.overflow =
      "hidden";

  } else {

    document.body.style.overflow =
      "auto";
  }

  return () => {

    document.body.style.overflow =
      "auto";
  };

}, [
  showMonthModal,
  showAddModal
]);

  return (

    <div>

    <div className="finance-header">

  <h2 className="finance-title">
    Finance
  </h2>
</div>

    {loading ? (
  <div style={{ padding: "0 16px" }}>
    <FinanceSkeleton count={6} />
  </div>
) : (
  <div className="month-grid">
    {months.map((month) => {

  const monthTransactionsForCard =
    transactions.filter(
      t =>
        t.monthKey ===
        month.monthKey
    );

  const totalSpent =
    monthTransactionsForCard.reduce(
      (sum, transaction) =>
        sum +
        Number(
          transaction.amount
        ),
      0
    );

  const cardCurrentBalance =
    Number(
      month.openingBalance
    ) - totalSpent;

  return (

    <div
      key={month.id}
      className="month-card"
          onClick={() => {

            setSelectedMonth(month);

            setShowMonthModal(true);

          }}
        >

         <h3>
  {month.monthName}
</h3>

<div className="month-stat">

  <span>
    Open
  </span>

  <strong>
    ₹{month.openingBalance}
  </strong>

</div>

<div className="month-stat">

  <span>
    Current
  </span>

  <strong>
  ₹{cardCurrentBalance}
</strong>

</div>

<div className="month-spent">

  ↓ ₹{totalSpent} spent

</div>

        </div>

      )
      })}
    </div>
  )}

  {showMonthModal && selectedMonth && (

  <div
    className="library-overlay"
    onClick={() =>
      setShowMonthModal(false)
    }
  >

    <div
      className="finance-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

    {showDeleteModal && (

  <>
    <div
      className="menu-backdrop"
      onClick={() =>
        setShowDeleteModal(false)
      }
    />

    <div
      className="delete-month-modal"
    >

      <h3 className="delete-title">
  Delete Month
</h3>

<p className="delete-description">

  This will permanently delete

  <span className="delete-month-name">
    • {selectedMonth.monthName} •
  </span>

  and all transactions inside it.

</p>

<div className="delete-actions">

  <button
    onClick={() =>
      setShowDeleteModal(false)
    }
  >
    Cancel
  </button>

  <button
    className="danger-btn"
    onClick={confirmDeleteMonth}
  >
    Delete
  </button>

</div>

    </div>

  </>

)}

<div className="finance-modal-header">

  <button
    className="library-close"
    onClick={() =>
      setShowMonthModal(false)
    }
  >
    ✕
  </button>

  <button
    className="month-menu-btn"
    onClick={() =>
      setShowDeleteModal(true)
    }
  >
    ⋯
  </button>

</div>

      <h2>
        {selectedMonth.monthName}
      </h2>

      <div className="finance-balance-row">

  <div className="finance-balance-card">

    <div>
      Opening Balance
    </div>

    <h3>
      ₹{selectedMonth.openingBalance}
    </h3>

  </div>

  <div className="finance-balance-card">

    <div>
      Current Balance
    </div>

    <h3>
      ₹{currentBalance}
    </h3>

  </div>

</div>

      <div className="finance-table-header">

  <span>Date</span>

  <span>Expense</span>

  <span>Balance</span>

</div>

      <div
  className="finance-transactions"
>

  {groupedTransactions.map(
    (transaction) => (

   <div
  key={transaction.date}
  className="finance-row"
>

  <div
    className="finance-row-header"
    onClick={() => {

      setExpandedDates(prev =>

        prev.includes(
          transaction.date
        )

          ? prev.filter(
              d =>
                d !==
                transaction.date
            )

          : [
              ...prev,
              transaction.date
            ]

      );

    }}
  >

    <div className="finance-date-group">

  <div>

    <div className="finance-date">
      {new Date(
        transaction.date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short"
        }
      )}
    </div>

    <div className="finance-count">
      {transaction.entries.length} entries
    </div>

  </div>

  <span
    className={`finance-chevron ${
      expandedDates.includes(
        transaction.date
      )
        ? "open"
        : ""
    }`}
  >
    ▾
  </span>

</div>

    <div>
      ₹{transaction.total}
    </div>

    <div>
      ₹{transaction.balance}
    </div>

  </div>

  {expandedDates.includes(
    transaction.date
  ) && (

    <div
      className="finance-expanded"
    >

      {transaction.entries.map(
        (entry) => (

          <div
            key={entry.id}
            className="finance-entry"
          >

            <span>
              {entry.note}
            </span>

            <div className="finance-entry-actions">

  <span>

  {entry.type === "credit"
    ? "+"
    : "-"}

  ₹{entry.amount}

</span>

  <button
    className="finance-delete-btn"
    onClick={() =>
      deleteTransaction(
        entry.id
      )
    }
  >
    <Trash2 size={16} color="#888" />
  </button>

</div>

          </div>

        )
      )}

    </div>

  )}

</div>

    )
  )}

</div>

    </div>

  </div>

)}

{showCreateMonth && (

  <div
    className="library-overlay"
    onClick={() =>
      setShowCreateMonth(false)
    }
  >

    <div
      className="finance-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <button
        className="library-close"
        onClick={() =>
          setShowCreateMonth(false)
        }
      >
        ✕
      </button>

      <h2>Create Month</h2>

<div className="finance-form">

  <input
  type="month"
    // placeholder="Month & Year (MM-YYYY)"
    value={monthName}
    onChange={(e) =>
      setMonthName(e.target.value)
    }
  />

  <input
    type="number"
    placeholder="Opening Balance"
    value={openingBalance}
    onChange={(e) =>
      setOpeningBalance(
        e.target.value
      )
    }
  />

  <button
    className="save-note-btn"
    onClick={createMonth}
  >
    Create Month
  </button>

</div>

    </div>

  </div>

)}

{showAddModal && (

  <div
    className="library-overlay"
    onClick={() =>
      setShowAddModal(false)
    }
  >

    <div
      className="finance-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <button
        className="library-close"
        onClick={() =>
          setShowAddModal(false)
        }
      >
        ✕
      </button>

      <h2>
  Add Expense
</h2>

<div className="finance-form">

  <input
    type="date"
    value={date}
    onChange={(e) =>
      setDate(e.target.value)
    }
  />

  <div className="transaction-type">

  <button
  type="button"
  className={
    transactionType === "expense"
      ? "type-active"
      : ""
  }
  onClick={() =>
    setTransactionType("expense")
  }
>
  Expense
</button>

<button
  type="button"
  className={
    transactionType === "credit"
      ? "type-active"
      : ""
  }
  onClick={() =>
    setTransactionType("credit")
  }
>
  Credit
</button>

</div>

  <input
    placeholder="Amount"
    value={amount}
    onChange={(e) =>
      setAmount(e.target.value)
    }
  />

  <input
    placeholder="Note"
    value={note}
    onChange={(e) =>
      setNote(e.target.value)
    }
  />

  <button
    className="save-note-btn"
    onClick={saveTransaction}
  >
    Save Expense
  </button>

</div>

    </div>

  </div>

)}

<>
<button
  className="add-finance-fab"
  onClick={openAddModal}
>
  +
</button>

<button
  className="add-month-fab"
  onClick={() =>
    setShowCreateMonth(true)
  }
>
  <CalendarDays size={25} />
</button>
</>

    </div>
  );
}