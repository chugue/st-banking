import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from "react-plaid-link";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import { Button } from "./ui/button";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.link_token);
    };
    getLinkToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      });

      router.push("/");
    },
    [user]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <Button
          className="plaidlink-primary shadow-none border-none "
          onClick={() => open()}
          disabled={!ready}
        >
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          onClick={() => open()}
          variant="ghost"
          className="plaidlink-ghost shadow-none border-none"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect-bank"
            width={24}
            height={24}
          />
          <p className="hidden xl:block text-[16px] font-semibold text-black-2">
            Connect Bank
          </p>
        </Button>
      ) : (
        <Button
          onClick={() => open()}
          className="plaidlink-default shadow-none border-none"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect-bank"
            width={24}
            height={24}
          />
          <p className="hidden xl:block text-[16px] font-semibold text-black-2">
            Connect Bank
          </p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
