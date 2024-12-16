import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ICall } from "@/models/Call";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface CallDetailsDialogProps {
  call: ICall;
}

export function CallDetailsDialog({ call }: CallDetailsDialogProps) {
  const [todoItems, setTodoItems] = useState(call.todoItems);

  const toggleTodoStatus = async (index: number) => {
    const newTodoItems = [...todoItems];
    newTodoItems[index].status = newTodoItems[index].status === "completed" ? "todo" : "completed";
    setTodoItems(newTodoItems);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Call Details - {format(new Date(call.startTime), "PPpp")}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="transcript" className="w-full">
          <TabsList>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="todos">Action Items</TabsTrigger>
          </TabsList>

          <TabsContent value="transcript" className="mt-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {call.transcript.map((entry, index) => (
                <div
                  key={index}
                  className="mb-4 rounded-lg p-3 bg-slate-100 dark:bg-slate-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{entry.speaker}</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(entry.timestamp), "pp")}
                    </span>
                  </div>
                  <p className="text-sm">{entry.text}</p>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="summary" className="mt-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="prose dark:prose-invert max-w-none">
                {call.summary}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="todos" className="mt-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-4">
                {todoItems.map((todo, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800"
                  >
                    <Checkbox
                      checked={todo.status === "completed"}
                      onCheckedChange={() => toggleTodoStatus(index)}
                    />
                    <div className="flex-1">
                      <p className={todo.status === "completed" ? "line-through" : ""}>
                        {todo.task}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
