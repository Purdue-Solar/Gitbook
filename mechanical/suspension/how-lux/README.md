# How Lux?

## What Ideas were Explored?

### Suspension Style

* Seeing as nearly every other top solar car we could find uses some variation of a double wishbone in the front, this was pretty much the only design we considered. There were some thoughts about running a MacPherson strut, but there were a couple big reasons we stayed away:\
  &#x20;   1\. We feared we would not have as much control over our wheel dynamics\
  &#x20;   2\. A MacPherson strut puts the shock absorber assembly in bending, which is not ideal for a couple of reasons: it is next to impossible to find a shock designed to be loaded in bending as small as we needed for the car, and putting the strut in bending causes some instability and lack of stiffness that we cannot afford to sacrifice when our car only weighs 180 kg and is prone to getting tossed around in the wind.

### Hub / Spindle

* We explored many designs for our hubs before settling on the weird-curvy-lots-of-nuts-having hub assembly we have on Lux now. When thinking about mounting the brake rotor, we knew we wanted to do a floating rotor to get equal pressure on the pads and maximize our stopping power. We considered doing simple float buttons seen on pretty much every other production and Formula SAE car, but doing this means the hub needs to some complicated mating shape and strength-to-weight ratio of this des\ign is hard to optimize considering manufacturing capabilities. Ultimately it was decided that the brake rotor would be secured to the hub using a large, thin nut with a mating contour to the inner diamter of the rotor. For the front left wheel, the threads are left-handed so when we brake, the threads tighten (right wheel is RH threads, we learned that the hard way). This design is very strong and there is pretty much no risk of anything breaking. BUT, sometimes you might wanna, ya know, take the brake rotor off the hub. Yeah, good luck. You'd have to travel backwards very fast, and brake very hard. Odds are even if you do that, the weight will trasnfer to the back of the car enough that the front wheels will just lock-up and you won't get enough force to loosen the threads. Even if you do manage to loosen the threads by braking hard enough in reverse, the rotor cap will just unthread and get jammed into the upright, and now you gotta deal with that. So yeah, long story short: it worked fine, but we will never be able to take the brake rotors off lol, so just keep that in mind.&#x20;
* We also explored using a castle nut as our wheel nut and spindle-nut-that-holds-the-upright-on-thingy, but we found we can achieve a smaller profile by using a large, low-profile nut with pin holes for an adjustable spanner wrench, and smaller radial holes for cotter pins. This was very nice for making the whole assemble lighter and reducing the profile, but the spanner wrench was a bad idea. It just sucks to work with, torquing sucks, and the pin holes get worn out. The cotter pins were designed to be small, but that ended up also sucking and judges did not like it. It had very little holding power when the wheel almost fell off during the race. For the next car, I think a large R-clip and changing from a spanner wrench to a custom impact socket would be good ideas.
* For spindle design, since the spindle is loaded in bending in multiple directions (bump/turn and braking), a hollow shape is the most efficient structure to produce a strong stress pattern. This makes machining more annoying, but it is definitely worth it to remove significant weight. Lux's spindles were made of Ti-6Al-4V because, well titanium is cool, but also because Grade 5 titanium is quite strong and stiff while being extremely light and having good fatigue properties. No fatigue analysis was done on any mechanical components on Lux.

### Shocks

* For mounting the shocks, we considered several different ideas. A pushrod was the top candidate, but with us having basically 0 experience we were concerned about doing it wrong. We were late in the design cycle at this point, and after forgetting that we needed to actually mount the shock to somewhere we needed something quick and simple. Since our suspension was fairly wide and we had already ordered our shocks, the only choices we could see were pushrod or a jank-ass chassis extension. If we were going to mount the shock to the chassis wall, it would have had to sit basically in the middle of our lower wishbone, mounted by some bracket either welded or bolted onto the lower arm. the bending moment on the lower arm would have been massive, and everything would have needed to be very stiff and strong. So unfortunately we were left with the chassis extension idea and I'll explain why it was so bad in [what-went-wrong-what-could-be-better.md](what-went-wrong-what-could-be-better.md "mention").
* We chose to use Gen 1 Cane Creek DB Coil IL 200mm x 50mm stroke mostly because we got a good discount and they had recently discontinued the Gen 1 product. In restrospect, we could have gone with a little bit longer of an eye-to-length length, but the 50mm stroke length was pretty good for not doing a push/pull rod. Note that the stroke length listed is without the bump stop and spacer that came with, so the actual stroke length ended up being more like 38-40mm. This worked pretty well, and you can alwas reduce stroke length if needed by adding spaces.
* We used Cane Creek Linear Vault springs. Since we ended up not using a push/pull rod, the effective spring rate at the wheel ended up decreasing with travel, so a progressive spring would have been nice. However, I think linear springs are the way to go if doing a push/pull rod since you have full control over your effective spring rate curve, but I guess its really a matter of personal preference. If you really want to avoid bottoming out or you want a little extra push at the end of your travel, go with progressive. For solar, it really does matter a whole lot as long as you make sure you don't bottom out and you can hit your ride height without insane preload.

### Wheel Bearings

* humunah

## 1. Setting Parameters and Choosing Hardpoints

### Defining Static and Dynamic Characteristics

&#x20;   The first thing we did after choosing a double wishbone geometry was lock in suspension geometry parameters. The main focus here was to make the suspension as efficient as possible while remaining stable. Wheel scrub is an efficiency killer, but having zero dynamic scrub is impossible (I think) with a double wishbone, but you can get very close. One way to reduce wheel scrub is make the FVSA really long, and good news for us: a longer FVSA tends to reduce camber gain on bump. For solar, we don't really want a ton of camber gain because we want to reduce wheel scrub, but we still need some to remain stable and maintain a good tire contact patch profile. A neat thing is that if your wishbone characteristics cause the wheel to pull in on bump, a little bit of camber gain can reduce scrub by negating movement of the center of the tire contact patch.\
&#x20;   To be perfectly clear, we knew jack shit about suspension design when we started. We missed lots of important things to think about and many of these things were not realized until long after the hardpoints were frozen. Things generally worked out partly due to luck, but also because we knew that we didn't know what we were doing, and we chose certain parameters based on general standards and design philosohpy. What I'm getting it is you don't need to analyze every little bit of a suspension and spend too much time trying to optimize each characteristic individually, if you follow a good design philosophy and go with general standards in areas where you don't know exactly what you're doing, things will tend to work out and you end up needing less time in design and still achieving optimal characteristics, even if you didn't know that characteristic was even something to design for. TLDR: keep it simple, look at pasts designs / literature and try to figure the big why's of the design.

#### Wheel Travel

70 mm





