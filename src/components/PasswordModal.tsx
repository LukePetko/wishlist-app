import { FC, PropsWithChildren, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type PasswordModalProps = {
	children: React.ReactNode;
};

const PasswordModal: FC<PropsWithChildren<PasswordModalProps>> = ({
	children,
}) => {
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState("");

	const handleReserveModeButton = async () => {
		const res = await fetch("/api/order-mode", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		});

		console.log(res);

		const data = await res.json();
		console.log(data);
		if (data.success) {
			setOpen(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="flex items-center justify-center">
				{children}
			</DialogTrigger>
			<DialogContent className="w-11/12 md:w-5/11 !max-w-screen-lg px-12 py-8 max-h-[75vh] overflow-y-auto flex gap-4 flex-col">
				<div className="flex flex-col gap-2">
					<DialogTitle className="text-3xl">Režim rezervovaných</DialogTitle>
					<p className="text-sm">
						Zadaním hesla budeš môcť označiť vec ako rezervovanú, aby ostatní
						vedeli, že už ju niekto kupuje 🙂
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Input
						className="w-full"
						placeholder="Heslo..."
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className="flex gap-2">
						<Button
							onClick={() => setOpen(false)}
							variant="outline"
							className="flex-1"
						>
							Zrušiť
						</Button>
						<Button onClick={handleReserveModeButton} className="flex-1">
							Uložiť heslo
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PasswordModal;
