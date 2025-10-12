import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AccountSettings() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-foreground">Account</h1>

      {/* Personal Information Section */}
      <section className="bg-card rounded-xl p-6 sm:p-8 shadow-sm border border-border">
        <h2 className="text-lg font-semibold mb-6 text-foreground">Personal information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              defaultValue="Mohammad Esam"
              className="bg-background border-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-foreground">
              Company
            </Label>
            <Input
              id="company"
              type="text"
              placeholder=""
              className="bg-background border-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="mohammad@example.com"
              className="bg-background border-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              defaultValue="(123) 456-7891"
              className="bg-background border-input"
            />
          </div>
        </div>
      </section>

      {/* Email Notifications Section */}
      <section className="bg-card rounded-xl p-6 sm:p-8 shadow-sm border border-border">
        <h2 className="text-lg font-semibold mb-6 text-foreground">Email notifications</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Checkbox id="newDeals" defaultChecked />
            <label
              htmlFor="newDeals"
              className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              New deals
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox id="passwordChanges" defaultChecked />
            <label
              htmlFor="passwordChanges"
              className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Password changes
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox id="newRestaurants" defaultChecked />
            <label
              htmlFor="newRestaurants"
              className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              New restaurants
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox id="specialOffers" defaultChecked />
            <label
              htmlFor="specialOffers"
              className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Special offers
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox id="orderStatuses" defaultChecked />
            <label
              htmlFor="orderStatuses"
              className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Order statuses
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox id="newsletter" defaultChecked />
            <label
              htmlFor="newsletter"
              className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Newsletter
            </label>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
        <Button variant="destructive" className="w-full sm:w-auto">
          Log out
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            Discard changes
          </Button>
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
