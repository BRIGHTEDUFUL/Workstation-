'use client';

const AccountPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="p-6 border-b shrink-0 border-border">
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your account details.
        </p>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed rounded-lg border-border bg-muted/20">
          <h2 className="text-xl font-semibold">Account Page Coming Soon</h2>
          <p className="mt-2 text-muted-foreground">
            This page is under construction.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
