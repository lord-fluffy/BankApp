// Enumerator for account types
enum AccountType {
    Checking = "Checking",
    Investment = "Investment",
}

// Enumerator for investment account subtypes
enum InvestmentType {
    Individual = "Individual",
    Corporate = "Corporate",
}

// Enumerator for transaction types
enum TransactionType {
    Deposit = "Deposit",
    Withdraw = "Withdraw",
    Transfer = "Transfer",
}

// Base class for accounts
class Account {
    constructor(public owner: string, public balance: number, public type: AccountType) {}

    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error("Deposit amount must be positive.");
        }
        this.balance += amount;
    }

    withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be positive.");
        }
        if (amount > this.balance) {
            throw new Error("Insufficient funds.");
        }
        this.balance -= amount;
    }
}

// Checking account class
class CheckingAccount extends Account {
    constructor(owner: string, balance: number) {
        super(owner, balance, AccountType.Checking);
    }
}

// Investment account class
class InvestmentAccount extends Account {
    constructor(owner: string, balance: number, public investmentType: InvestmentType) {
        super(owner, balance, AccountType.Investment);
    }

    withdraw(amount: number): void {
        if (this.investmentType === InvestmentType.Individual && amount > 500) {
            throw new Error("Individual investment accounts have a withdrawal limit of $500");
        }
        super.withdraw(amount);
    }
}

// Bank class
class Bank {
    private accounts: Account[] = [];

    constructor(public name: string) {}

    addAccount(account: Account): void {
        this.accounts.push(account);
    }

    getAccount(owner: string): Account | undefined {
        return this.accounts.find(account => account.owner === owner);
    }

    transfer(fromOwner: string, toOwner: string, amount: number): void {
        const fromAccount = this.getAccount(fromOwner);
        const toAccount = this.getAccount(toOwner);

        if (!fromAccount || !toAccount) {
            throw new Error("One or both accounts not found.");
        }

        fromAccount.withdraw(amount);
        toAccount.deposit(amount);
    }
}

// Test class to demonstrate functionality
class BankTest {
    static runTests(): void {
        const bank = new Bank("Test Bank");

        const checkingAccount = new CheckingAccount("John Doe", 1000);
        const individualInvestmentAccount = new InvestmentAccount("Jane Doe", 2000, InvestmentType.Individual);
        const corporateInvestmentAccount = new InvestmentAccount("OPENLANE Investments", 5000, InvestmentType.Corporate);

        bank.addAccount(checkingAccount);
        bank.addAccount(individualInvestmentAccount);
        bank.addAccount(corporateInvestmentAccount);

        // Test deposit
        checkingAccount.deposit(500);
        console.log(`Checking Account Balance after deposit: $${checkingAccount.balance}`); // Should output 1500

        // Test withdrawal
        individualInvestmentAccount.withdraw(300);
        console.log(`Individual Investment Account Balance after withdrawal: $${individualInvestmentAccount.balance}`); // Should output 1700

        // Test transfer
        bank.transfer("John Doe", "OPENLANE Investments", 200);
        console.log(`Checking Account Balance after transfer: $${checkingAccount.balance}`); // Should output 1300
        console.log(`Corporate Investment Account Balance after transfer: $${corporateInvestmentAccount.balance}`); // Should output 5200

        // Test withdrawal limit on Individual Investment Account
        try {
            individualInvestmentAccount.withdraw(600);
        } catch (e) {
            console.log((e as Error).message); // Should output "Individual investment accounts have a withdrawal limit of $500."
        }

        // Test transfer with Insufficient funds
        try {
            bank.transfer("John Doe", "OPENLANE Investments", 1800);
        } catch (e) {
            console.log((e as Error).message); // Should output "Insufficient Funds"
        }
    }
}

// Run the tests
BankTest.runTests();
