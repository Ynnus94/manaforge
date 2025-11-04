/**
 * Settings Content
 * 
 * Tabbed settings interface
 */

'use client';

import type { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch'; // TODO: Install switch component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserIcon, Sparkles, Bell, Shield } from 'lucide-react';

interface SettingsContentProps {
  user: User;
}

export function SettingsContent({ user }: SettingsContentProps) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">
          <UserIcon className="h-4 w-4 mr-2" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="ai">
          <Sparkles className="h-4 w-4 mr-2" />
          AI
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="account">
          <Shield className="h-4 w-4 mr-2" />
          Account
        </TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your public profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ''} disabled />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Your username" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* AI Preferences Tab */}
      <TabsContent value="ai">
        <Card>
          <CardHeader>
            <CardTitle>AI Preferences</CardTitle>
            <CardDescription>
              Customize how the AI assistant helps you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-open AI Chat</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically open AI chat on startup
                </p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>

            <div className="space-y-2">
              <Label>Default Playstyle</Label>
              <Select defaultValue="balanced">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aggro">Aggro</SelectItem>
                  <SelectItem value="control">Control</SelectItem>
                  <SelectItem value="midrange">Midrange</SelectItem>
                  <SelectItem value="combo">Combo</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Budget Preference</Label>
              <Select defaultValue="mid">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget (&lt;$50)</SelectItem>
                  <SelectItem value="mid">Mid ($50-$200)</SelectItem>
                  <SelectItem value="high">High ($200-$500)</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Suggest Reprints</Label>
                <p className="text-sm text-muted-foreground">
                  AI will suggest cheaper reprints when available
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>

            <Button>Save AI Preferences</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Control what notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Price Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when cards in your collection change price
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Set Releases</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new MTG sets are released
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Suggestions</Label>
                <p className="text-sm text-muted-foreground">
                  Get AI suggestions for deck improvements
                </p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>

            <Button>Save Notification Preferences</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Tab */}
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account settings and security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Change Password</Label>
              <Button variant="outline">Update Password</Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label className="text-destructive">Danger Zone</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

