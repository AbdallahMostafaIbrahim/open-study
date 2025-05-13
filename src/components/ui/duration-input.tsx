"use client";

import { useState, useEffect } from "react";
import { FormControl, FormDescription, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

interface DurationInputProps {
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    description?: string;
    label: string;
}

export default function DurationInput({
    value,
    onChange,
    description,
    label,
}: DurationInputProps) {
    // Calculate hours, minutes, seconds from total seconds
    const [hours, setHours] = useState<number | undefined>(
        value ? Math.floor(value / 3600) : undefined
    );
    const [minutes, setMinutes] = useState<number | undefined>(
        value ? Math.floor((value % 3600) / 60) : undefined
    );
    const [seconds, setSeconds] = useState<number | undefined>(
        value ? value % 60 : undefined
    );

    // Update the parent form value when any unit changes
    useEffect(() => {
        // If all fields are empty or undefined, set undefined
        if (hours === undefined && minutes === undefined && seconds === undefined) {
            onChange(undefined);
            return;
        }

        // Calculate total seconds
        const totalSeconds =
            (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);

        // Don't update if totalSeconds is 0 and all fields are empty strings
        // This prevents converting empty strings to 0
        if (totalSeconds === 0 &&
            hours === undefined &&
            minutes === undefined &&
            seconds === undefined) {
            onChange(undefined);
        } else {
            onChange(totalSeconds);
        }
    }, [hours, minutes, seconds, onChange]);

    // When the parent value changes, recalculate our local state
    useEffect(() => {
        if (value === undefined) {
            setHours(undefined);
            setMinutes(undefined);
            setSeconds(undefined);
        } else {
            setHours(Math.floor(value / 3600));
            setMinutes(Math.floor((value % 3600) / 60));
            setSeconds(value % 60);
        }
    }, [value]);    // Function to reset all values
    const handleReset = () => {
        setHours(undefined);
        setMinutes(undefined);
        setSeconds(undefined);
        onChange(undefined);
    };

    // Check if any value is set
    const hasValue = hours !== undefined || minutes !== undefined || seconds !== undefined;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <FormLabel>{label}</FormLabel>                {hasValue && (
                    <Button
                        type="button"
                        onClick={handleReset}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs font-normal text-muted-foreground"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                    </Button>
                )}
            </div>
            <div className="flex flex-row gap-2">
                <div className="flex-1">
                    <FormControl>
                        <div className="flex flex-col">
                            <Input
                                type="number"
                                placeholder="Hours"
                                min="0"
                                value={hours ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setHours(val === "" ? undefined : Number(val));
                                }}
                            />
                            <span className="text-xs text-center mt-1 text-muted-foreground">Hours</span>
                        </div>
                    </FormControl>
                </div>
                <div className="flex-1">
                    <FormControl>
                        <div className="flex flex-col">
                            <Input
                                type="number"
                                placeholder="Minutes"
                                min="0"
                                max="59"
                                value={minutes ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setMinutes(val === "" ? undefined : Number(val));
                                }}
                            />
                            <span className="text-xs text-center mt-1 text-muted-foreground">Minutes</span>
                        </div>
                    </FormControl>
                </div>
                <div className="flex-1">
                    <FormControl>
                        <div className="flex flex-col">
                            <Input
                                type="number"
                                placeholder="Seconds"
                                min="0"
                                max="59"
                                value={seconds ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSeconds(val === "" ? undefined : Number(val));
                                }}
                            />
                            <span className="text-xs text-center mt-1 text-muted-foreground">Seconds</span>
                        </div>
                    </FormControl>
                </div>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
        </div>
    );
}
