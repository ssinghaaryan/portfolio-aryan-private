import "./Finance.css";

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

export default function Finance() {

  const [months, setMonths] =
    useState([]);

  const [transactions, setTransactions] =
    useState([]);

  const [selectedMonth, setSelectedMonth] =
    useState(null);

  const [showMonthModal, setShowMonthModal] =
    useState(false);

  const [showAddModal, setShowAddModal] =
    useState(false);

    const [amount, setAmount] =
  useState("");

const [note, setNote] =
  useState("");

  const [expandedDates, setExpandedDates] =
  useState([]);

  const [showCreateMonth, setShowCreateMonth] =
  useState(false);

const [monthName, setMonthName] =
  useState("");

const [openingBalance, setOpeningBalance] =
  useState("");

const [date, setDate] =
  useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );
    
    const loadTransactions =
  async () => {

  const snapshot =
    await getDocs(
      collection(
        db,
        "financeTransactions"
      )
    );

  const data =
    snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  setTransactions(data);
};

const createMonth = async () => {

  if (
    !monthName.trim() ||
    !openingBalance
  ) return;

  const monthKey =
    new Date(monthName)
      .toISOString()
      .slice(0, 7);

  await addDoc(
    collection(
      db,
      "financeMonths"
    ),
    {
      monthName:
  new Date(monthName)
    .toLocaleString(
      "default",
      {
        month: "long",
        year: "numeric"
      }
    ),
      monthKey,
      openingBalance:
        Number(openingBalance),
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
      type: "expense",
      note,
      createdAt:
        Date.now()
    }
  );

  setAmount("");
  setNote("");
  setShowAddModal(false);
  loadTransactions();
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

    const snapshot =
      await getDocs(
        collection(
          db,
          "financeMonths"
        )
      );

    const data =
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    setMonths(data);
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

        acc[date].total +=
          Number(transaction.amount);
        acc[date].entries.push({
  note: transaction.note,
  amount: transaction.amount,
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

useEffect(() => {
  loadMonths();
  loadTransactions();
}, []);



  return (

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

      <button
        className="library-close"
        onClick={() =>
          setShowMonthModal(false)
        }
      >
        ✕
      </button>

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

      <h2>
        Create Month
      </h2>

      <input
        type="month"
        onChange={(e) =>
          setMonthName(
            e.target.value
          )
        }
      />

      <input
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

      <input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(
            e.target.value
          )
        }
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(
            e.target.value
          )
        }
      />

      <input
        placeholder="Note"
        value={note}
        onChange={(e) =>
          setNote(
            e.target.value
          )
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

)}

<>
<button
  className="add-finance-fab"
  onClick={() =>
    setShowAddModal(true)
  }
>
  +<IndianRupee size={25} />
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