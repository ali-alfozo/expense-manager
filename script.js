 const totalBalanceEl = document.getElementById('total-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const addBtn = document.getElementById('add-btn');
const transactionsListEl = document.getElementById('transactions-list');
 let transactions = []; //هاي مصفوفة لحتى خزن المعاملات يعني الداتا تبعيت اليوزر 

 //هاي تاني خطوة دالة عرض الداتا
 //هاي تهم دالة يعني تعبتر قلب الكود 
 // اهم وظائفها حساب الاجماليات وتحديث الاراقام  وعرض المعاملات
function calculateTotals() {
    let totalIncome = 0;//متغير يرمز إلى مجموع كل الدخول
    let totalExpense = 0;//متغير يرمز إلى مجموع كل المصروفات
  for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type === 'income') {
            totalIncome += transactions[i].amount;
        } else {
            totalExpense += transactions[i].amount;
        }
    }
    const balance = totalIncome - totalExpense;//بحسبو لكرة واحدة 
    return { totalIncome, totalExpense, balance };

}
 // تاني شي هوي الدالو ريندر المسؤولة عن اضافة معامل وحضف معامل 
 function render() {
    // 1. حساب الإجماليات
    const { totalIncome, totalExpense, balance } = calculateTotals();
    
    // 2. تحديث العناصر في الصفحة
    totalIncomeEl.innerText = totalIncome;
    totalExpenseEl.innerText = totalExpense;
    totalBalanceEl.innerText = balance;
     document.getElementById('transaction-count').innerText = `عدد المعاملات: ${transactions.length}`;
    
    if (transactions.length === 0) {  // 3. بناء HTML لقائمة المعاملات
        transactionsListEl.innerHTML = '<div class="empty-msg">لا توجد معاملات حتى الآن</div>';
        return;
    }
    let html = '';
    for (let i = 0; i < transactions.length; i++) {
        const t = transactions[i];
        const sign = t.type === 'income' ? '+' : '-';
        const amountClass = t.type === 'income' ? 'income' : 'expense';
        html += `
            <div class="transaction-item ${amountClass}">
                <div class="transaction-info">
                    <strong>${t.desc}</strong>
                </div>
                <div class="transaction-amount">
                    ${sign} ${t.amount}
                </div>
                <button class="delete-btn" data-id="${t.id}">🗑 حذف</button>
            </div>
        `;
    }
    transactionsListEl.innerHTML = html;
    
    // 4. إضافة مستمعات الأحداث لأزرار الحذف
    const deleteBtns = document.querySelectorAll('.delete-btn');
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteTransaction(id);
        });
    }
}
//دالة الحذف مهمة 
function deleteTransaction(id) {
    if (confirm('هل تريد حذف هذه المعاملة؟')) {
        // نفلتر المصفوفة: نأخذ كل المعاملات التي id مختلف عن id المطلوب
        const newTransactions = [];//الاسهل اني ضيف مصفوفة فارغة  للحذف وما استخدم الاساسية 
        // وما حذفت من المصفوفة الاساسية لانو بجوز يعمل مشاكل   
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].id !== id) {//ا بيمثل الرقم اللي بدو يحذفو اليوزر اللي هوي نفسو مرقناه ك بارمتر id  ل 

                newTransactions.push(transactions[i]);//تحديث المصفوفة الأصلية
            }
        }
        transactions = newTransactions;
         saveToLocal(); // حفظ التغييرات في localStorage
        render(); // نعيد الرسم بعد الحذف
    }
}
function addTransaction() {
    const desc = descInput.value.trim();//هاد حقل النص اللي اليوزر كتب فيه  الراتب او ايجار
    //trim بتشيل المسافات من والبداية والنهاية 
    let amount = parseFloat(amountInput.value);//بتحول النصالمكتوي بالعربية ل رقم
    const type = typeSelect.value;//تاخد القيمة المختارة من القائمة المنسدلة
    
    if (desc === '') {//التحقق من صحة البيانات 
        alert('يرجى كتابة وصف للمعاملة');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('المبلغ يجب أن يكون رقمًا موجبًا');
        return;
    }
    
    let newId = 1;// بفرضو من عندي 
    if (transactions.length > 0) {
        let maxId = transactions[0].id;
        for (let i = 1; i < transactions.length; i++) {
            if (transactions[i].id > maxId) maxId = transactions[i].id;
        }
        newId = maxId + 1;
    }
    //هون انشأت كائن فيو كل الخصائص اللي حسبناها وجمعناها 
    const newTransaction = {
        id: newId,
        desc: desc,
        amount: amount,
        type: type
    };
    
    transactions.push(newTransaction)//  إضافة المعاملة إلى المصفوفة الرئيسية
    //نظف البيانات عشان المستخدم يضيف معاملة جديدة بسهولة
     saveToLocal();
    descInput.value = '';
    amountInput.value = '';
    typeSelect.value = 'income';
    
    render();
}
addBtn.addEventListener('click', addTransaction);
function saveToLocal() {
    localStorage.setItem('expense_tracker', JSON.stringify(transactions));
}
function loadData() {
    const saved = localStorage.getItem('expense_tracker');
    if (saved) {
        transactions = JSON.parse(saved);   // استرجاع البيانات المخزنة
    } else {
        // أول مرة يفتح التطبيق (لا توجد بيانات مخزنة)
        transactions = [
            { id: 1, desc: 'راتب', amount: 500000, type: 'income' },
            { id: 2, desc: 'إيجار', amount: 150000, type: 'expense' }
        ];
    }
    render();    
}   
function deleteAll() {
    if (transactions.length === 0) {
        alert('لا توجد معاملات لحذفها');
        return;
    }
    if (confirm('هل أنت متأكد من حذف جميع المعاملات؟ لا يمكن التراجع.')) {
        transactions = [];
        saveToLocal();
        render();
    }
}
document.getElementById('delete-all-btn').addEventListener('click', deleteAll);
loadData();
 const themeToggle = document.getElementById('theme-toggle');   

 const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️ Light';
} else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙 Dark';
}

 themeToggle.addEventListener('click', () => {
    if (document.documentElement.hasAttribute('data-theme')) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙 Dark';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️ Light';
    }
});