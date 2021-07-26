import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { userSession } from '../components/Stacks';
import { useContext } from 'react';
import { ThemeContext } from '../components/Layout';

export default function Home() {
  const { theme } = useContext(ThemeContext);
  return (
    <main
      className={(styles.body, theme === 'light' ? styles.light : styles.dark)}
    >
      <div className={styles.body}>
        <div className={styles.shapes}>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
        </div>
        <div className={styles.svg}>
          <div className={styles.heading}>
            <h1 className={styles.h1}>
              The <span>first</span> STX mining pool.
            </h1>
          </div>

          {!userSession.isUserSignedIn() && (
            <Link href="/join" passHref={true}>
              <button className={styles.getStartedButton}>Join the Pool</button>
            </Link>
          )}
          {userSession.isUserSignedIn() && (
            <Link href="/dashboard" passHref={true}>
              <button className={styles.joinButton}>Go to Dashboard</button>
            </Link>
          )}

          <div className={styles.custodial}>
            <p>
              Sypool is a custodial STX mining pool using smart contracts on the
              Stacks Ӿ blockchain for trustless contributions & reward
              redemption.
            </p>
          </div>
          <div className={`${styles.two}`}>
            <p className={styles.subheading1}>wait, what?</p>

            <p>
              Since Stacks is anchored to the Bitcoin blockchain, we have the
              unique ability to verify that Bitcoin transactions happened on
              Stacks. This means when people contribute with Bitcoin to our pool
              address, we can verify this happened through a trustless smart
              contract.
            </p>

            <p>
              Sypool is <span>partially</span> trustless. While you have to
              trust your funds aren’t misused, any contributions will always be
              redeemable through the smart contract.
            </p>
            <p>
              Meaning the only trust in Sypool is that we are reputable and only
              mine STX with contributed funds. Of which we strive to be, and
              will do.
            </p>
          </div>

          <div className={styles.three}>
            <h2>Powered by Syvirean tech</h2>
            <p className={styles.strength}>
              strength in numbers, trust in none
            </p>
            <p className={styles.built}>
              Sypool is built by Syvita Guild, a decentralised guild (we’re a
              DAO). Arguably the largest entity in the Stacks ecosystem by
              member & project count, we are behind some of the largest projects
              on Stacks.
            </p>

            <p className={styles.quote}>
              “Syvita is probably the biggest decentralised entity in the Stacks
              ecosystem. They’re building a new world.”
            </p>
            <p className={styles.quoteAuthor}>— someone, probably</p>
          </div>

          <div className={styles.banner}>
            <div>Syphre</div>
            <div>MiamiPool</div>
            <div>ApexOS</div>
            <div>Bithority</div>
            <div>Lightlane</div>
            <div>Scramblr</div>
            <div>Hub</div>
            <div>daoOS</div>
            <div>Nothing token</div>
            <div>Metaverse</div>
            <div>Sypool</div>
            <div>Syphre</div>
            <div>MiamiPool</div>
            <div>ApexOS</div>
            <div>Bithority</div>
            <div>Lightlane</div>
            <div>Scramblr</div>
            <div>Hub</div>
            <div>daoOS</div>
            <div>Nothing token</div>
            <div>Metaverse</div>
            <div>Sypool</div>
            <div>Syphre</div>
            <div>MiamiPool</div>
            <div>ApexOS</div>
            <div>Bithority</div>
            <div>Lightlane</div>
            <div>Scramblr</div>
            <div>Hub</div>
            <div>daoOS</div>
            <div>Nothing token</div>
            <div>Metaverse</div>
            <div>Sypool</div>
            <div>Syphre</div>
            <div>MiamiPool</div>
            <div>ApexOS</div>
            <div>Bithority</div>
            <div>Lightlane</div>
            <div>Scramblr</div>
            <div>Hub</div>
            <div>daoOS</div>
            <div>Nothing token</div>
            <div>Metaverse</div>
            <div>Sypool</div>
            {/* <div className={styles.bannerone}>
            <span>Syphre</span>
            <span>MiamiPool</span>
            <span>ApexOS</span>
            <span>Bithority</span>
            <span>Lightlane</span>
            <span>Scramblr</span>
            <span>Hub</span> <span>daoOS</span>
            <span>Nothing token</span>
            <span>Metaverse</span>
            <span>Sypool</span>&nbsp;&nbsp;&nbsp;
          </div>
          <div className={styles.bannertwo}>
            <span>Syphre</span>
            <span>MiamiPool</span>
            <span>ApexOS</span>
            <span>Bithority</span>
            <span>Lightlane</span>
            <span>Scramblr</span>
            <span>Hub</span> <span>daoOS</span>
            <span>Nothing token</span>
            <span>Metaverse</span>
            <span>Sypool</span>&nbsp;&nbsp;&nbsp;
          </div>
          <div className={styles.bannerthree}>
            <span>Syphre</span>
            <span>MiamiPool</span>
            <span>ApexOS</span>
            <span>Bithority</span>
            <span>Lightlane</span>
            <span>Scramblr</span>
            <span>Hub</span> <span>daoOS</span>
            <span>Nothing token</span>
            <span>Metaverse</span>
            <span>Sypool</span>&nbsp;&nbsp;&nbsp;
          </div>
          <div className={styles.bannerfour}>
            <span>Syphre</span>
            <span>MiamiPool</span>
            <span>ApexOS</span>
            <span>Bithority</span>
            <span>Lightlane</span>
            <span>Scramblr</span>
            <span>Hub</span> <span>daoOS</span>
            <span>Nothing token</span>
            <span>Metaverse</span>
            <span>Sypool</span>&nbsp;&nbsp;&nbsp;
          </div> */}
          </div>

          <h2 className={styles.nokyc}>No KYC, no AML, no bullsh!t</h2>
          <div className={styles.four}>
            <p className={styles.private}>private & secure by design</p>
            <p>
              We’re pretty annoyed (putting it nicely) with unfair and
              unnecessary regulations on the legacy banking system. It’s why
              we’re building on Bitcoin with Stacks. So all of our projects are
              designed privacy-first and dunked in the finest
              cryptographically-ensured security dip.
            </p>
            <p className={styles.wallet}>
              You only need a Bitcoin wallet and Stacks wallet.
            </p>
            <p>
              Data minimalisation, no central databases and dummy-thicc privacy
              walls allow us to run Sypool without even knowing who you are.
              Plainly, we don’t care either. And that’s a good thing. We believe
              in extreme equality, so why should we have any data to personally
              identify you in the first place? No reason. So we don’t.
            </p>
          </div>
          <div>
            <p className={styles.ridiculous}>
              Ridiculously strong privacy & security tech
            </p>
            <div className={styles.securityFeatures}>
              <div>Always-on HTTPS</div>
              <div>HTTP Strict Transport Security</div>
              <div>Min. TLS 1.3</div>
              <div>DNSSEC</div>
              <div>ECDSA</div>
              <div>Keccak256</div>
            </div>
          </div>
          <div className={styles.getStarted}>
            <p>Get started</p>
            {!userSession.isUserSignedIn() && (
              <Link href="/join" passHref={true}>
                <button className={styles.joinButton}>Join the Pool</button>
              </Link>
            )}
            {userSession.isUserSignedIn() && (
              <Link href="/dashboard" passHref={true}>
                <button className={styles.joinButton}>Go to Dashboard</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
