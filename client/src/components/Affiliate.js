import React from 'react'
import { Link } from 'react-router-dom'
import "./componentCss/affiliate.css"
    const data = [
        {
            id:1,
            htext:"Earn money easily",
            lists:[
                {
                    id:1,
                    list:"A rapidly growing affiliate program"
                },{
                    id:2,
                    list:"We offer a variety of creative materials such as banners, text links, emails..."
                },{
                    id:3,
                    list:"You choose the fields you want"
                }
            ]
        },{
            id:2,
            htext:(
                <>
                <Link className='lineLink' to="https://partner.instapro.com/anmelden.cgi?new=1&cpid=5">Sign up</Link> for our one-click program
                </>
            ),
            lists:[
                {
                    id: 1,
                    list:"Create your profile on our Netslave platform"
                },{
                    id: 2,
                    list:"Integrate our banners into your website"
                },{
                    id: 3,
                    list:"Users click on your links and post jobs on our website"
                },{
                    id: 4,
                    list:"Werkspot pays commission for each lead"
                }
            ]
        },{
            id:3,
            htext:"Who can register?",
            lists:[
                {
                    id:1,
                    list: (
                        <>
                        Content websites, emails (under certain conditions) or price guides: <Link className='lineLink' to="https://partner.instapro.com/anmelden.cgi?new=1&cpid=5">sign up now!</Link>
                        </>
                    )
                },{
                    id:2,
                    list:"Do not hesitate to contact us even if you do not fall into the above categories. We will carefully consider every request."
                },{
                    id: 3,
                    list:"Allowed channels: Display, text links, email (subject to conditions)"
                },{
                    id: 4,
                    list:"Dedicated partnership manager that offers you guidance and support to optimize your performance."
                }
            ]
        },{
            id:4,
            htext:"Support we provide:",
            lists: [
                {
                    id:1,
                    list:"Fast confirmations and payments"
                }, {
                    id:2,
                    list:"Clear and accurate reporting and follow-up process"
                }, {
                    id:3,
                    list:"Multiple and seasonal creative materials"
                }, {
                    id:4,
                    list:"Dedicated partnership manager that offers you guidance and support to optimize your performance."
                }
            ]
        }
    ]

const Affiliate = () => {
  return (
    <div className='container'>
        <div className='affiliate-hero'>
        <h2 className='affiliate-title'>Satış ortağı olun</h2>
        <p className='updateTime'>
04-09-2023 tarihinde güncellendi</p>
        <div className='affiliate-body'>
        <h3> Ev sahiplerini ve zanaatkarları buluşturan Avrupa'nın önde gelen pazarıyla çalışın</h3>
        <p>Werkspot.nl, ev sahiplerinin ihtiyaç duydukları profesyonelleri işe almaları ve profesyonellere istedikleri işi almaları için güvenilir yoldur. Her ay 40.000'den fazla aktif esnaf ve ev sahibi tarafından yayınlanan 150.000 iş ilanıyla Werkspot, ev içinde ve çevresinde küçük ve büyük her türlü işletme için pazarda lider bir oyuncu olarak kendini kanıtlamıştır.</p>
        <p>Platform, ev içi ve çevresindeki tüm işletmeler için Avrupa'nın lider pazarı olan Instapro Group'un bir parçasıdır. Instapro Grubu, Hollanda'daki Werkspot.nl'nin yanı sıra Fransa, Almanya, Avusturya, İtalya ve Hollanda dahil olmak üzere diğer Avrupa ülkelerinde de faaliyet göstermektedir.</p>
        </div>
        </div>
        <div className='affiliate-lists'>
            {data.map((data)=>(
                <div className='list-item' key={data.id}>
                    <h3>{data.htext}</h3>
                    <ol className='list-ol'>
                        {data.lists.map((e)=>(
                            <li key={e.id}>
                                {e.list}
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
        </div>
        <div className='affiliate-bottom'>
            <>
            <h3>Nasıl çalışıyoruz?</h3>
            <p>Çevrimiçi platformumuz, yenileme, bakım çalışmaları veya onarımlar olsun, ev içindeki ve çevresindeki tüm işler için ev sahiplerini Hollanda genelinde doğrulanmış ve onaylanmış yerel profesyonellerle buluşturur. Ev sahipleri çalışmalarını ücretsiz olarak yayınlayabilir ve mevcut profesyonellerden yanıt alabilir; Kiminle bağlantı kuracaklarına karar vermeden önce profillerini görüntüleyebilir ve önceki müşterilerin yorumlarını okuyabilirler.</p>
            </>
            <>
            <h3>Seni bekliyoruz! <Link className='lineLink' to="https://partner.instapro.com/anmelden.cgi?new=1&cpid=5">Şimdi üye Ol</Link></h3>
            <p>Herhangi bir sorunuz veya endişeniz varsa lütfen affiliate@instapro.com adresinden bizimle iletişime geçin.</p>
            </>
        </div>
    </div>
  )
}

export default Affiliate