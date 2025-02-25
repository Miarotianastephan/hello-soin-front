import { Input, Typography } from "@material-tailwind/react";
import { Controller } from "react-hook-form";

const ColorPicker = ({ control, name, label, rules }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <div className="flex flex-col">
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                    >{label}</Typography>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={field.value ? field.value : "#ffffff"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-10 h-10 bg-white rounded-lg cursor-pointer"
                            onBlur={field.onBlur} // Important for validation
                        />
                        <Input
                            type="text"
                            value={field.value ? field.value : "#ffffff"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className=""
                            onBlur={field.onBlur} // Important for validation
                            error={!!fieldState.error} // Display error state
                        />
                    </div>
                    {fieldState.error && (
                        <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                    )}
                </div>
            )}
        />
    );
};
export default ColorPicker;