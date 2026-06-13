import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function DailyIncome() {
    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>
                    Daily incomes
                </CardTitle>
                <CardDescription>
                    {/**TODO show the relation between expected incomes and paid incomes 
               * Temporal placeholders
              */}
                    <p className="text-muted-foreground">1200/<span className="text-accent-foreground">2500</span></p>
                </CardDescription>
            </CardHeader>
        </Card>
    )
}