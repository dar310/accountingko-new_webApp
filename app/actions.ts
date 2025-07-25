"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
//import { emailClient } from "./utils/brevo";
import { formatCurrency } from "./utils/formatCurrency";


export async function onboardUser(prevState: any, formData: FormData) {
    const session = await requireUser();
  
    const submission = parseWithZod(formData, {
      schema: onboardingSchema,
    });
  
    if (submission.status !== "success") {
      return submission.reply();
    }
  
    const data = await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        
      },
    });
  
    return redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
    const session = await requireUser();
  
    const submission = parseWithZod(formData, {
      schema: invoiceSchema,
    });
  
    if (submission.status !== "success") {
      return submission.reply();
    }
  
    const data = await prisma.invoice.create({
      data: {
        clientAddress: submission.value.clientAddress,
        clientEmail: submission.value.clientEmail,
        clientName: submission.value.clientName,
        currency: "PHP",
        date: submission.value.date,
        dueDate: submission.value.dueDate,
        fromAddress: submission.value.fromAddress,
        fromEmail: submission.value.fromEmail,
        fromName: submission.value.fromName,
        invoiceItemDescription: submission.value.invoiceItemDescription,
        invoiceItemQuantity: submission.value.invoiceItemQuantity,
        invoiceItemRate: submission.value.invoiceItemRate,
        invoiceName: submission.value.invoiceName,
        invoiceNumber: submission.value.invoiceNumber,
        status: submission.value.status,
        total: submission.value.total,
        note: submission.value.note,
        userId: session.user?.id,
      },
    });

//    const sender = {
//      email: "dardex999@gmail.com",
//      name: "Darren Lewis Ngo"
//    };
//
//    emailClient.send({
//      from: sender,
//      to: [{email: 'dlrngo@mymail.mapua.edu.ph'}],
//      template_uuid: "e4d66573-3de2-47de-83e7-b6cce54aeefb",
//      template_variables: {
//      "clientName": submission.value.clientName,
//      "invoiceNumber": submission.value.invoiceNumber,
//      "dueDate": new Intl.DateTimeFormat("en-US", {
//        dateStyle: "medium",
//      }).format(new Date(submission.value.date)),
//      "totalAmount": formatCurrency({
//        amount: submission.value.total,
//        currency: submission.value.currency as any,
//      }),
//      "invoiceLink": `http://localhost:3000/api/invoice/${data.id}`
//    }
//    });

    return redirect("/dashboard/invoices")
}

export async function editInvoice(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
      schema: invoiceSchema,
    });

    if(submission.status !== "success"){
      return submission.reply();
    }

    const data = await prisma.invoice.update({
      where: {
        id: formData.get('id') as string,
        userId: session.user?.id
      },
      data: {
        clientAddress: submission.value.clientAddress,
        clientEmail: submission.value.clientEmail,
        clientName: submission.value.clientName,
        currency: "PHP",
        date: submission.value.date,
        dueDate: submission.value.dueDate,
        fromAddress: submission.value.fromAddress,
        fromEmail: submission.value.fromEmail,
        fromName: submission.value.fromName,
        invoiceItemDescription: submission.value.invoiceItemDescription,
        invoiceItemQuantity: submission.value.invoiceItemQuantity,
        invoiceItemRate: submission.value.invoiceItemRate,
        invoiceName: submission.value.invoiceName,
        invoiceNumber: submission.value.invoiceNumber,
        status: submission.value.status,
        total: submission.value.total,
        note: submission.value.note,
      }
    })
  
//    const sender = {
//      email: "dardex999@gmail.com",
//      name: "Darren Lewis Ngo"
//    };
//
//    emailClient.send({
//      from: sender,
//      to: [{email: 'dlrngo@mymail.mapua.edu.ph'}],
//      template_uuid: "4f79dfa5-179f-4655-a10d-60d27af3ec65",
//      template_variables: {
//      "clientName": submission.value.clientName,
//      "invoiceNumber": submission.value.invoiceNumber,
//      "dueDate": new Intl.DateTimeFormat("en-US", {
//        dateStyle: "medium",
//      }).format(new Date(submission.value.date)),
//      "totalAmount": formatCurrency({
//        amount: submission.value.total,
//        currency: submission.value.currency as any,
//      }),
//      "invoiceLink": `http://localhost:3000/api/invoice/${data.id}`
//    }
//    });
    
  return redirect("/dashboard/invoices")
}

export async function DeleteInvoice(invoiceId: string) {
  const session = await requireUser();

  const data = await prisma.invoice.delete({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
  });

  return redirect("/dashboard/invoices");
}

export async function MarkAsPaidAction(invoiceId: string) {
  const session = await requireUser();

  const data = await prisma.invoice.update({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
    data: {
      status: "PAID",
    },
  });

  return redirect("/dashboard/invoices");
}