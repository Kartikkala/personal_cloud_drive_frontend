import { Popover } from "radix-ui";
import { useState } from "react";
import AvatarCustom from "./AvatarCustom";
import EditUserDialog from "./EditUserDialog";

const EditUserPopover  = ()=>{

    const[open, setOpen] =  useState(false)

    return (
        <Popover.Root open={open} onOpenChange={setOpen}> 
		<Popover.Trigger className="mx-auto">
			<AvatarCustom src="https://github.com/shadcn.png" size={150}/>
		</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content className="PopoverContent" side={"bottom"} align="end" alignOffset={-200} sideOffset={8}
			onPointerDownOutside={()=>{setOpen(false)}}>
			<EditUserDialog/>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
    )
}

export default EditUserPopover;