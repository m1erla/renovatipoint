import {FaRegHandshake} from "react-icons/fa"
import {BsCalendar3,BsClipboard2Check} from "react-icons/bs"
import {PiChatsCircleFill} from "react-icons/pi"
import {TfiPencilAlt} from "react-icons/tfi"
import {FiAward} from "react-icons/fi"

export const quailtCardData = [
    {
        id:1,
        icon: <FaRegHandshake />,
        h3:"Treat the customer with respect both on and off the platform.",
        p:"Clean up after work. Treat a paying customer like a professional entrepreneur. Do not use physical or verbal abuse. Of course, respect comes from both sides, and Werkspot also draws attention to the responsibility of the consumer."
    },{
        id:2,
        icon: <BsCalendar3/>,
        h3:"Follow the agreements with the customer.",
        p:"As an entrepreneur, you are busy. We understand this. Therefore, it is quite possible that sometimes you will not be able to fulfill an agreement made due to circumstances. Make sure you communicate this well and in a timely manner, make a new appointment and apologize.",
        lists: ["Shows up when getting quotes and arrives on time", "The offer is delivered within the agreed time", "Shows up doing the job and arrives on time"]
    },{
        id:3,
        icon: <PiChatsCircleFill /> ,
        h3:"Communicate clearly with the client about (extra) costs, when you can start, and how long the job will take.",
        p:"Consumers want clarity and precision. They don't like surprises. You are the expert and the consumer trusts your image. So be sure to communicate openly if anything is disappointing. Be sure to clearly state what the planning is in advance."
    },{
        id:4,
        icon:<TfiPencilAlt/>,
        h3:"Give professional messages.",
        p:"When consumers decide on a business for a large investment, they expect a professional message. So make sure you write in plain English. Do not make unrealistically low offers. Also, don't use warnings about costs associated with consumer response. Your quotes are also clear and understandable. Communicate clearly about VAT and payment method.",
    },{
        id:5,
        icon:<FiAward/>,
        h3:"Do a good job, finish the job and resolve complaints appropriately.",
        p:"The most important thing is, of course, that you produce high-quality work. You don't take on tasks you can't actually perform. You finish your job properly and you don't let the consumer down. Something can always go wrong and a complaint can arise. It is especially important that you handle this correctly. Can't get along with the customer? Then you can always contact us for advice.",
    },{
        id:6,
        icon:<BsClipboard2Check/>,
        h3:"Conditions",
        p:(
            <p>
            By using our platform you automatically agree to these house rules. In the event of a complaint, we investigate and may proceed with a final warning or removal based on the trading company's history. <a href="#">If you have any questions and/or comments, you can reach us at info@werkspot.nl</a> or at 088-9375793.
            </p>
        ),
    }
]