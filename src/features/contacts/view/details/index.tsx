import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { ContactDetailsDto } from "lib/network/swagger-client";
import { CoreModule, viewFormRoute } from "lib/router";
import { useRequestContext } from "providers/request-provider";
import { useRouteParams } from "typesafe-routes";
import { ContactCardHeader, ContactRowGrid } from "../../index.styled";
import { toast } from "react-toastify";
import { getCountryList, useCoreModuleNavigation } from "utils/helper";
import DeleteIcon from "@mui/icons-material/Delete";

export const ContactView = () => {
  const context = useRequestContext();
  const handleNavigation = useCoreModuleNavigation();
  const { client } = context;
  const { id } = useRouteParams(viewFormRoute);
  const [contact, setContact] = useState<ContactDetailsDto>({
    email: "",
  });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await client.api.contactsDetail(id);
        setCountry(data.countryCode);
        setContact(data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [client]);

  const setCountry = async (countryCode: string | null | undefined) => {
    if (countryCode) {
      const countries = await getCountryList(context);
      if (countries) {
        const countryList = Object.entries(countries).map(([code, name]) => ({ code, name }));
        setSelectedCountry(countryList.find((c) => c.code === countryCode)!.name);
        setIsLoading(false);
      } else {
        toast.error("Server error: country list not available.");
      }
    }
  };

  const handleDelete = () => {
    setOpenConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setOpenConfirmation(false);
  };

  const handleConfirmation = async () => {
    setOpenConfirmation(false);
    try {
      await client.api.contactsDelete(contact.id!);
      toast.success("Contact deleted!.");
      handleNavigation(CoreModule.contacts);
    } catch (error) {
      console.log(error);
      toast.error("Server error: contact not deleted.");
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} item>
          <Card>
            <CardContent>
              <ContactCardHeader title="Contact Details"></ContactCardHeader>
              <Divider variant="fullWidth" />
              <ContactRowGrid container>
                <Grid item xs={2}>
                  <Typography fontWeight="bold">Email</Typography>
                </Grid>
                <Grid item xs={10}>
                  {contact.email}
                </Grid>
              </ContactRowGrid>
              <Divider variant="fullWidth" />
              <ContactRowGrid container>
                <Grid item xs={2}>
                  <Typography fontWeight="bold">Phone</Typography>
                </Grid>
                <Grid item xs={10}>
                  {contact.phone}
                </Grid>
              </ContactRowGrid>
              <Divider variant="fullWidth" />
              <ContactRowGrid container>
                <Grid item xs={2}>
                  <Typography fontWeight="bold">Country</Typography>
                </Grid>
                {!isLoading && (
                  <Grid item xs={10}>
                    {selectedCountry}
                  </Grid>
                )}
              </ContactRowGrid>
              <Divider variant="fullWidth" />
              <ContactRowGrid container>
                <Grid item xs={2}>
                  <Typography fontWeight="bold">City</Typography>
                </Grid>
                <Grid item xs={10}>
                  {contact.cityName}
                </Grid>
              </ContactRowGrid>
              <Divider variant="fullWidth" />
              <ContactRowGrid container>
                <Grid item xs={2}>
                  <Typography fontWeight="bold">Address 1</Typography>
                </Grid>
                <Grid item xs={10}>
                  {contact.address1}
                </Grid>
              </ContactRowGrid>
              <Divider variant="fullWidth" />
              <ContactRowGrid container>
                <Grid item xs={2}>
                  <Typography fontWeight="bold">Address 2</Typography>
                </Grid>
                <Grid item xs={10}>
                  {contact.address2}
                </Grid>
              </ContactRowGrid>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} item>
          <Card>
            <CardContent>
              <ContactCardHeader title="Invoices/Billing"></ContactCardHeader>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} item>
          <Card>
            <CardContent>
              <ContactCardHeader title="Emails"></ContactCardHeader>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} item>
          <Card>
            <CardContent>
              <ContactCardHeader title="Other actions"></ContactCardHeader>
            </CardContent>
            <CardContent>
              <Typography>
                {`Remove this customer's data if he requested that, if not please be aware that what
                has been deleted can never be brought back`}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<DeleteIcon />}
                type="submit"
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                Delete Account
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={openConfirmation} onClose={handleConfirmationClose}>
        <DialogTitle>{`Deleting contact ${contact.email}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this contact?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} autoFocus variant="outlined">
            No
          </Button>
          <Button onClick={handleConfirmation} autoFocus variant="outlined" color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
