// components/UserProfileForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {UserProfileFormValues, UserProfileSchema} from "@/schema/user-profile-form-schema";
import {CircleCheck, TriangleAlert} from "lucide-react";

interface User {
    id: string;
    username: string;
    name: string;
    surname: string;
    email: string;
}

export default function UserProfileForm({ initialUserData }: { initialUserData: User }) {
    const router = useRouter();
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const form = useForm<UserProfileFormValues>({
        resolver: zodResolver(UserProfileSchema),
        defaultValues: {
            username: initialUserData.username,
            name: initialUserData.name,
            surname: initialUserData.surname,
            email: initialUserData.email,
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (values: UserProfileFormValues) => {
        setSubmitError(null);
        setSubmitSuccess(false);
        setIsSubmitting(true);

        try {
            const payload = {
                ...values,
                ...(!showPasswordFields && { password: undefined })
            };

            const response = await fetch(`/api/users/${initialUserData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            setSubmitSuccess(true);
            setShowPasswordFields(false);
            form.reset({
                ...values,
                password: '',
                confirmPassword: ''
            });
            router.refresh();

            // Auto-hide success message after 3 seconds
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <CardContent className="space-y-4">
                        {submitError && (
                            <Alert variant="destructive">
                                <TriangleAlert className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{submitError}</AlertDescription>
                            </Alert>
                        )}

                        {submitSuccess && (
                            <Alert>
                                <CircleCheck  className="h-4 w-4" />
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>Your profile has been updated successfully.</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Select
                                    value={showPasswordFields ? 'change' : 'keep'}
                                    onValueChange={(val) => setShowPasswordFields(val === 'change')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Password option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="keep">Keep current password</SelectItem>
                                        <SelectItem value="change">Change password</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="surname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Surname</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {showPasswordFields && (
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}